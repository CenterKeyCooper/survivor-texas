import type { NextApiRequest, NextApiResponse } from 'next';
import { getAirtableBase } from '@/lib/airtable';
import { CrewNote } from '@/types/data';

const TABLE_NAME = 'Crew Notes'; // Change this to match your Airtable table name

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const base = getAirtableBase();
    const table = base(TABLE_NAME);

    if (req.method === 'GET') {
      // Fetch notes for a specific crew member
      const { crewId } = req.query;

      if (!crewId || typeof crewId !== 'string') {
        return res.status(400).json({ error: 'crewId is required' });
      }

      // Only fetch notes where password is 'joyce'
      const records = await table
        .select({
          filterByFormula: `AND({Crew ID} = "${crewId}", {Password} = "joyce")`,
          sort: [{ field: 'Created', direction: 'desc' }],
        })
        .all();

      const notes: CrewNote[] = records.map((record) => {
        // Handle date field - Airtable returns dates in various formats
        let createdAt = new Date().toISOString();
        const createdField = record.fields['Created'];
        if (createdField) {
          if (typeof createdField === 'string') {
            createdAt = createdField;
          } else if (createdField instanceof Date) {
            createdAt = createdField.toISOString();
          } else if (typeof createdField === 'object' && 'toString' in createdField) {
            // Airtable date objects might have a toString method
            createdAt = new Date(createdField.toString()).toISOString();
          }
        }

        return {
          id: record.id,
          crewId: (record.fields['Crew ID'] as string) || '',
          content: (record.fields['Content'] as string) || '',
          author: (record.fields['Author'] as string) || '',
          createdAt,
        };
      });

      return res.status(200).json({ notes });
    }

    if (req.method === 'POST') {
      // Create a new note
      const { crewId, content, author, password } = req.body;

      if (!crewId || !content || !author || !password) {
        return res.status(400).json({ 
          error: 'crewId, content, author, and password are required' 
        });
      }

      // Create record with Created field in ISO 8601 format
      // Airtable date fields accept ISO 8601 strings
      const now = new Date();
      const fieldsToCreate = {
        'Crew ID': crewId,
        'Content': content,
        'Author': author,
        'password': password,
        'Created': now.toISOString(), // ISO 8601 format for Airtable date fields
      };

      const record = await table.create(fieldsToCreate);

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

      const note: CrewNote = {
        id: record.id,
        crewId: (record.fields['Crew ID'] as string) || crewId,
        content: (record.fields['Content'] as string) || content,
        author: (record.fields['Author'] as string) || author,
        createdAt,
      };

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
        errorMessage = `Table "${TABLE_NAME}" not found. Please check that the table name matches exactly.`;
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

