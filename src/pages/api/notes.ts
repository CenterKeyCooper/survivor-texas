import type { NextApiRequest, NextApiResponse } from 'next';
import { getAirtableBase } from '@/lib/airtable';
import { Note, NoteType } from '@/types/data';

// Map note types to their Airtable table names and ID field names
const TABLE_CONFIG: Record<NoteType, { tableName: string; idField: string }> = {
  crew: { tableName: 'Crew Notes', idField: 'Crew ID' },
  player: { tableName: 'Player Notes', idField: 'Player ID' },
  season: { tableName: 'Season Notes', idField: 'Season ID' },
  forum: { tableName: 'Forum Notes', idField: '' }, // Forum doesn't need an ID
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const base = getAirtableBase();
    const { type } = req.query;

    if (!type || typeof type !== 'string' || !['crew', 'player', 'season', 'forum'].includes(type)) {
      return res.status(400).json({ error: 'Valid type (crew, player, season, or forum) is required' });
    }

    const noteType = type as NoteType;
    const config = TABLE_CONFIG[noteType];
    const table = base(config.tableName);

    if (req.method === 'GET') {
      // Fetch notes
      const { id } = req.query;

      // Forum doesn't need an ID, but others do
      if (noteType !== 'forum' && (!id || typeof id !== 'string')) {
        return res.status(400).json({ error: `${noteType}Id is required` });
      }

      // Build filter formula
      let filterFormula = '{password} != "a"';
      if (noteType !== 'forum' && id) {
        filterFormula = `AND({${config.idField}} = "${id}", ${filterFormula})`;
      }

      const records = await table
        .select({
          filterByFormula: filterFormula,
          sort: [{ field: 'Created', direction: 'desc' }],
        })
        .all();

      const notes: Note[] = records.map((record) => {
        // Handle date field - Airtable returns dates in various formats
        let createdAt = new Date().toISOString();
        const createdField = record.fields['Created'];
        if (createdField) {
          if (typeof createdField === 'string') {
            createdAt = createdField;
          } else if (createdField instanceof Date) {
            createdAt = createdField.toISOString();
          } else if (typeof createdField === 'object' && 'toString' in createdField) {
            createdAt = new Date(createdField.toString()).toISOString();
          }
        }

        const note: Note = {
          id: record.id,
          content: (record.fields['Content'] as string) || '',
          author: (record.fields['Author'] as string) || '',
          createdAt,
        };

        // Add the appropriate ID field based on type
        if (noteType === 'crew' && record.fields[config.idField]) {
          note.crewId = record.fields[config.idField] as string;
        } else if (noteType === 'player' && record.fields[config.idField]) {
          note.playerId = record.fields[config.idField] as string;
        } else if (noteType === 'season' && record.fields[config.idField]) {
          note.seasonId = record.fields[config.idField] as string;
        }

        return note;
      });

      return res.status(200).json({ notes });
    }

    if (req.method === 'POST') {
      // Create a new note
      const { id, content, author, password } = req.body;

      if (!content || !author || !password) {
        return res.status(400).json({ 
          error: 'content, author, and password are required' 
        });
      }

      // Forum doesn't need an ID, but others do
      if (noteType !== 'forum' && !id) {
        return res.status(400).json({ 
          error: `${noteType}Id is required` 
        });
      }

      // Create record with Created field in ISO 8601 format
      const now = new Date();
      const fieldsToCreate: any = {
        'Content': content,
        'Author': author,
        'password': password,
        'Created': now.toISOString(),
      };

      // Add ID field if not forum
      if (noteType !== 'forum') {
        fieldsToCreate[config.idField] = id;
      }

      const record = await table.create(fieldsToCreate) as any;

      // Handle date field when reading back
      let createdAt = new Date().toISOString();
      const createdField = record.fields['Created'];
      if (createdField) {
        if (typeof createdField === 'string') {
          createdAt = createdField;
        } else if (createdField instanceof Date) {
          createdAt = createdField.toISOString();
        } else if (typeof createdField === 'object' && 'toString' in createdField) {
          createdAt = new Date(createdField.toString()).toISOString();
        }
      }

      const note: Note = {
        id: record.id,
        content: (record.fields['Content'] as string) || content,
        author: (record.fields['Author'] as string) || author,
        createdAt,
      };

      // Add the appropriate ID field based on type
      if (noteType === 'crew' && record.fields[config.idField]) {
        note.crewId = record.fields[config.idField] as string;
      } else if (noteType === 'player' && record.fields[config.idField]) {
        note.playerId = record.fields[config.idField] as string;
      } else if (noteType === 'season' && record.fields[config.idField]) {
        note.seasonId = record.fields[config.idField] as string;
      }

      return res.status(201).json({ note });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Airtable API error:', error);
    
    // Provide more detailed error messages
    let errorMessage = 'Failed to process request';
    let errorDetails = 'Unknown error';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || error.message;
      
      // Check for common Airtable errors
      if (error.message.includes('Could not find table')) {
        const { type } = req.query;
        const tableName = type && typeof type === 'string' && ['crew', 'player', 'season', 'forum'].includes(type)
          ? TABLE_CONFIG[type as NoteType].tableName
          : 'Unknown';
        errorMessage = `Table "${tableName}" not found. Please check that the table name matches exactly.`;
      } else if (error.message.includes('Could not find what you are looking for')) {
        errorMessage = 'Base or table not found. Please check your AIRTABLE_BASE_ID and table name.';
      } else if (error.message.includes('authentication')) {
        errorMessage = 'Authentication failed. Please check your AIRTABLE_PAT.';
      } else if (error.message.includes('INVALID_VALUE_FOR_COLUMN') || error.message.includes('cannot accept the provided value')) {
        errorMessage = `Field error: ${error.message}. This usually means a field is auto-populated or the value format is incorrect.`;
      } else if (error.message.includes('field')) {
        errorMessage = `Field error: ${error.message}. Please check that all field names match exactly.`;
      }
    }

    return res.status(500).json({ 
      error: errorMessage,
      details: errorDetails
    });
  }
}

