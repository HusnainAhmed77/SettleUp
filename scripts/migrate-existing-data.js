const { Client, Databases, Query } = require('node-appwrite');

// Configuration
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://tor.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691acc3e001a5242479f')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const APP_DATABASE_ID = '691c3c350001948e8960'; // settleup_Data

async function migrateExistingData() {
    console.log('🔄 Starting data migration...\n');

    try {
        // 1. Migrate existing groups - set adminUserId and initialize sharedWith
        console.log('📋 Migrating groups collection...');
        let groupsUpdated = 0;
        let groupsOffset = 0;
        const groupsLimit = 100;
        let hasMoreGroups = true;

        while (hasMoreGroups) {
            const groupsResponse = await databases.listDocuments(
                APP_DATABASE_ID,
                'groups',
                [
                    Query.limit(groupsLimit),
                    Query.offset(groupsOffset)
                ]
            );

            for (const group of groupsResponse.documents) {
                try {
                    // Check if adminUserId already exists
                    if (!group.adminUserId) {
                        await databases.updateDocument(
                            APP_DATABASE_ID,
                            'groups',
                            group.$id,
                            {
                                adminUserId: group.userId,
                                sharedWith: group.sharedWith || '[]'
                            }
                        );
                        groupsUpdated++;
                    }
                } catch (error) {
                    console.log(`⚠️  Error updating group ${group.$id}:`, error.message);
                }
            }

            groupsOffset += groupsLimit;
            hasMoreGroups = groupsResponse.documents.length === groupsLimit;
        }

        console.log(`✅ Updated ${groupsUpdated} groups\n`);

        // 2. Migrate existing user profiles - initialize googleProfilePicture
        console.log('📋 Migrating user_profiles collection...');
        let profilesUpdated = 0;
        let profilesOffset = 0;
        const profilesLimit = 100;
        let hasMoreProfiles = true;

        while (hasMoreProfiles) {
            const profilesResponse = await databases.listDocuments(
                APP_DATABASE_ID,
                'user_profiles',
                [
                    Query.limit(profilesLimit),
                    Query.offset(profilesOffset)
                ]
            );

            for (const profile of profilesResponse.documents) {
                try {
                    // Check if googleProfilePicture field exists
                    if (profile.googleProfilePicture === undefined) {
                        await databases.updateDocument(
                            APP_DATABASE_ID,
                            'user_profiles',
                            profile.$id,
                            {
                                googleProfilePicture: null
                            }
                        );
                        profilesUpdated++;
                    }
                } catch (error) {
                    console.log(`⚠️  Error updating profile ${profile.$id}:`, error.message);
                }
            }

            profilesOffset += profilesLimit;
            hasMoreProfiles = profilesResponse.documents.length === profilesLimit;
        }

        console.log(`✅ Updated ${profilesUpdated} user profiles\n`);

        console.log('🎉 Migration completed successfully!');
        console.log('\n📝 Summary:');
        console.log(`   ✓ ${groupsUpdated} groups migrated`);
        console.log(`   ✓ ${profilesUpdated} user profiles migrated`);

    } catch (error) {
        console.error('❌ Error during migration:', error);
        process.exit(1);
    }
}

// Run the migration
migrateExistingData();
