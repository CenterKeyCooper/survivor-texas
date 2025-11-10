# Airtable Setup Guide for Crew Notes

This guide will help you set up your Airtable base to work with the crew notes feature.

## Step 1: Create Your Airtable Base

1. Go to [Airtable](https://airtable.com) and create a new base (or use an existing one)
2. Create a new table called **"Crew Notes"** (this name must match exactly)

## Step 2: Set Up the Table Fields

In your "Crew Notes" table, create the following fields with these exact names and types:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| **Crew ID** | Single line text | The crew member's ID (e.g., "cooperwilk", "joyceqin") |
| **Content** | Long text | The note content |
| **Author** | Single line text | Name of the person who left the note |
| **Password** | Single line text | Password for the note (only notes with password "joyce" are displayed) |
| **Created** | Date with time | When the note was created (sent in ISO 8601 format) |

**Important:** 
- The field names must match exactly as shown above (case-sensitive).
- Airtable will automatically create a primary "ID" field (autonumber) - this is fine and doesn't need to be referenced in the code.
- The "Created" field is automatically set to the current timestamp when a note is created (in ISO 8601 format).
- Only notes with password "joyce" will be displayed on the website. All notes are stored in Airtable, but filtered when displayed.

## Step 3: Get Your Base ID

1. Open your Airtable base
2. Look at the URL in your browser. It will look like:
   ```
   https://airtable.com/appXXXXXXXXXXXXXX/...
   ```
3. The Base ID is the part after `/app` and before the next `/`
   - Example: If your URL is `https://airtable.com/appabc123def456/...`, your Base ID is `appabc123def456`

## Step 4: Set Up Environment Variables

1. Create a file called `.env.local` in the root of your project (same directory as `package.json`)
2. Add the following variables:

```env
AIRTABLE_PAT=patoxQp4WndJvYtrV.e5c7d3fb146779181dfe28e0f5e25e18b6cd9e3e5b46b6c982c1ffef4d179c69
AIRTABLE_BASE_ID=your_base_id_here
```

Replace `your_base_id_here` with the Base ID you found in Step 3.

**Note:** The `.env.local` file is already in `.gitignore`, so your Personal Access Token won't be committed to version control.

## Step 5: Configure Airtable Permissions

Make sure your Personal Access Token has the following scopes:
- `data.records:read` - To read notes
- `data.records:write` - To create new notes

You can manage your tokens at: https://airtable.com/create/tokens

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to a crew member page (e.g., `/crew/cooperwilk`)
3. Scroll down to the "Notes" section
4. Try adding a note with your name and some content
5. The note should appear immediately after submission

## Troubleshooting

### Notes not loading?
- Check that your `.env.local` file exists and has the correct values
- **Restart your dev server** after creating/updating `.env.local` (environment variables are only loaded on startup)
- Verify that your Base ID is correct (should start with "app")
- Make sure the table name is exactly "Crew Notes" (case-sensitive)
- Check that field names match exactly: "Crew ID", "Content", "Author", "Password", "Created"
- Check the browser console and server logs for detailed error messages
- The error message on the page should now show the specific issue

### Can't create notes?
- Verify your Personal Access Token has `data.records:write` permission
- Check the browser console for error messages
- Check your server terminal for detailed error logs
- Verify the API route is working by checking `/api/crew/notes?crewId=cooperwilk` in your browser

### Getting "Failed to load notes" error?
1. **Check your server terminal** - detailed error messages are logged there
2. **Check the browser console** - the error message should now show the specific issue
3. **Verify environment variables:**
   ```bash
   # Make sure .env.local exists and has both variables
   cat .env.local
   ```
4. **Test your Airtable connection:**
   - Verify your PAT is correct
   - Verify your Base ID is correct
   - Make sure the table name matches exactly

### Field name errors?
- Field names in Airtable are case-sensitive
- Make sure there are no extra spaces in field names
- The exact field names must be: "Crew ID", "Content", "Author", "Password", "Created"
- The primary "ID" field (autonumber) is fine and doesn't need to be referenced

### Common Error Messages:
- **"Table 'Crew Notes' not found"** → Check that your table name matches exactly (case-sensitive)
- **"Base or table not found"** → Check your AIRTABLE_BASE_ID
- **"Authentication failed"** → Check your AIRTABLE_PAT
- **"Field error"** → Check that all field names match exactly

## Adding Notes from Airtable

You can also add notes directly in Airtable, and they will appear on the crew pages automatically. Just make sure:
- The "Crew ID" field matches the crew member's ID (e.g., "cooperwilk")
- Fill in the "Content" and "Author" fields
- Set the "Password" field to "joyce" if you want the note to be displayed on the website
- The "Created" field will be set automatically when notes are created via the website, or you can set it manually in Airtable

**Note:** Only notes with password "joyce" will be displayed on the website. Notes with other passwords will be stored in Airtable but hidden from public view.

