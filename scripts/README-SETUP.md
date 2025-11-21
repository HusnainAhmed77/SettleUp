# Appwrite Collections and Storage Setup

This script sets up the required Appwrite collections and storage for the friends-and-admin-system feature.

## Prerequisites

1. Node.js installed
2. Appwrite API key with admin permissions
3. Access to the Appwrite project

## Setup Instructions

### 1. Set Environment Variables

You need to set the `APPWRITE_API_KEY` environment variable. You can get this from your Appwrite console:

1. Go to your Appwrite console: https://tor.cloud.appwrite.io/console
2. Navigate to your project
3. Go to Settings > API Keys
4. Create a new API key with the following scopes:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `attributes.read`
   - `attributes.write`
   - `indexes.read`
   - `indexes.write`
   - `buckets.read`
   - `buckets.write`

### 2. Run the Setup Script

```bash
# From the app-frontend directory
cd app-frontend

# Set your API key
export APPWRITE_API_KEY="your_api_key_here"

# Run the setup script
node scripts/setup-friends-admin-collections.js
```

## What This Script Creates

### 1. Friends Collection (`friends`)
- **Attributes:**
  - `userId` (String, 255) - Required
  - `friendUserId` (String, 255) - Required
  - `friendEmail` (String, 255) - Required
  - `friendName` (String, 255) - Required
  - `friendProfilePicture` (String, 500) - Optional
  - `status` (String, 50) - Required, Default: "active"
  - `addedAt` (String, 50) - Required

- **Indexes:**
  - `userId_index` - Key on `userId` (ASC)
  - `friendUserId_index` - Key on `friendUserId` (ASC)
  - `composite_index` - Unique on `userId` + `friendUserId`

- **Permissions:**
  - Read: Users (authenticated)
  - Create: Users (authenticated)
  - Update: Users (authenticated)
  - Delete: Users (authenticated)

### 2. Admin Settlements Collection (`admin_settlements`)
- **Attributes:**
  - `groupId` (String, 255) - Required
  - `adminUserId` (String, 255) - Required
  - `fromUserId` (String, 255) - Required
  - `toUserId` (String, 255) - Required
  - `amountCents` (Integer) - Required
  - `currency` (String, 10) - Required, Default: "USD"
  - `notes` (String, 1000) - Optional
  - `recordedAt` (String, 50) - Required

- **Indexes:**
  - `groupId_index` - Key on `groupId` (ASC)
  - `adminUserId_index` - Key on `adminUserId` (ASC)

- **Permissions:**
  - Read: Users (authenticated)
  - Create: Users (authenticated)
  - Delete: Users (authenticated)

### 3. Groups Collection Updates
Adds the following attributes to the existing `groups` collection:
- `adminUserId` (String, 255) - Required
- `sharedWith` (String, 10000) - Required, Default: "[]"

### 4. User Profiles Collection Updates
Adds the following attribute to the existing `user_profiles` collection:
- `googleProfilePicture` (String, 500) - Optional

### 5. Profile Pictures Storage Bucket (`profile_pictures`)
- **Configuration:**
  - Max file size: 5MB
  - Allowed extensions: jpg, jpeg, png, gif, webp
  - Compression: gzip
  - Encryption: Enabled
  - Antivirus: Enabled

- **Permissions:**
  - Read: Any (public read)
  - Create: Users (authenticated)
  - Update: Users (authenticated)
  - Delete: Users (authenticated)

## Troubleshooting

### Error: "Missing API Key"
Make sure you've set the `APPWRITE_API_KEY` environment variable.

### Error: "Collection already exists" (409)
This is normal if you've run the script before. The script will skip existing collections and continue.

### Error: "Attribute already exists" (409)
This is normal if you've run the script before. The script will skip existing attributes and continue.

### Error: "Insufficient permissions"
Make sure your API key has all the required scopes listed above.

## Data Migration

After running this script, you may need to migrate existing data:

1. **Existing Groups**: Set `adminUserId` to `userId` for all existing groups
2. **Existing Profiles**: Set `googleProfilePicture` to null for existing users
3. **Initialize sharedWith**: Set `sharedWith` to empty array `[]` for existing groups

You can create a separate migration script for this if needed.

## Verification

After running the script, verify in your Appwrite console:

1. Go to Databases > settleup_Data
2. Check that `friends` and `admin_settlements` collections exist
3. Check that `groups` collection has `adminUserId` and `sharedWith` attributes
4. Check that `user_profiles` collection has `googleProfilePicture` attribute
5. Go to Storage and verify `profile_pictures` bucket exists

## Next Steps

After successful setup:
1. Update your application code to use the new collections
2. Implement the FriendService, AdminService, and ProfileService
3. Create UI components for friend management, admin controls, and profile settings
