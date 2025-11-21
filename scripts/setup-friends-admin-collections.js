const { Client, Databases, Storage, Permission, Role, ID } = require('node-appwrite');

// Configuration
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://tor.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691acc3e001a5242479f')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const APP_DATABASE_ID = '691c3c350001948e8960'; // settleup_Data

async function setupCollectionsAndStorage() {
    console.log('🚀 Starting Appwrite collections and storage setup...\n');

    try {
        // 1. Create Friends Collection
        console.log('📋 Creating friends collection...');
        try {
            await databases.createCollection(
                APP_DATABASE_ID,
                'friends',
                'friends',
                [
                    Permission.read(Role.users()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users())
                ]
            );
            console.log('✅ Friends collection created');

            // Add attributes to friends collection
            await databases.createStringAttribute(APP_DATABASE_ID, 'friends', 'userId', 255, true);
            await databases.createStringAttribute(APP_DATABASE_ID, 'friends', 'friendUserId', 255, true);
            await databases.createStringAttribute(APP_DATABASE_ID, 'friends', 'friendEmail', 255, true);
            await databases.createStringAttribute(APP_DATABASE_ID, 'friends', 'friendName', 255, true);
            await databases.createStringAttribute(APP_DATABASE_ID, 'friends', 'friendProfilePicture', 500, false);
            await databases.createStringAttribute(APP_DATABASE_ID, 'friends', 'status', 50, true, 'active');
            await databases.createStringAttribute(APP_DATABASE_ID, 'friends', 'addedAt', 50, true);
            
            console.log('✅ Friends collection attributes created');

            // Create indexes
            await databases.createIndex(APP_DATABASE_ID, 'friends', 'userId_index', 'key', ['userId'], ['ASC']);
            await databases.createIndex(APP_DATABASE_ID, 'friends', 'friendUserId_index', 'key', ['friendUserId'], ['ASC']);
            await databases.createIndex(APP_DATABASE_ID, 'friends', 'composite_index', 'unique', ['userId', 'friendUserId'], ['ASC', 'ASC']);
            
            console.log('✅ Friends collection indexes created\n');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  Friends collection already exists\n');
            } else {
                throw error;
            }
        }

        // 2. Create Admin Settlements Collection
        console.log('📋 Creating admin_settlements collection...');
        try {
            await databases.createCollection(
                APP_DATABASE_ID,
                'admin_settlements',
                'admin_settlements',
                [
                    Permission.read(Role.users()),
                    Permission.create(Role.users()),
                    Permission.delete(Role.users())
                ]
            );
            console.log('✅ Admin settlements collection created');

            // Add attributes
            await databases.createStringAttribute(APP_DATABASE_ID, 'admin_settlements', 'groupId', 255, true);
            await databases.createStringAttribute(APP_DATABASE_ID, 'admin_settlements', 'adminUserId', 255, true);
            await databases.createStringAttribute(APP_DATABASE_ID, 'admin_settlements', 'fromUserId', 255, true);
            await databases.createStringAttribute(APP_DATABASE_ID, 'admin_settlements', 'toUserId', 255, true);
            await databases.createIntegerAttribute(APP_DATABASE_ID, 'admin_settlements', 'amountCents', true);
            await databases.createStringAttribute(APP_DATABASE_ID, 'admin_settlements', 'currency', 10, true, 'USD');
            await databases.createStringAttribute(APP_DATABASE_ID, 'admin_settlements', 'notes', 1000, false);
            await databases.createStringAttribute(APP_DATABASE_ID, 'admin_settlements', 'recordedAt', 50, true);
            
            console.log('✅ Admin settlements collection attributes created');

            // Create indexes
            await databases.createIndex(APP_DATABASE_ID, 'admin_settlements', 'groupId_index', 'key', ['groupId'], ['ASC']);
            await databases.createIndex(APP_DATABASE_ID, 'admin_settlements', 'adminUserId_index', 'key', ['adminUserId'], ['ASC']);
            
            console.log('✅ Admin settlements collection indexes created\n');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  Admin settlements collection already exists\n');
            } else {
                throw error;
            }
        }

        // 3. Update Groups Collection Schema
        console.log('📋 Updating groups collection schema...');
        try {
            await databases.createStringAttribute(APP_DATABASE_ID, 'groups', 'adminUserId', 255, true);
            console.log('✅ Added adminUserId attribute to groups collection');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  adminUserId attribute already exists in groups collection');
            } else {
                console.log('⚠️  Error adding adminUserId:', error.message);
            }
        }

        try {
            await databases.createStringAttribute(APP_DATABASE_ID, 'groups', 'sharedWith', 10000, true, '[]');
            console.log('✅ Added sharedWith attribute to groups collection\n');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  sharedWith attribute already exists in groups collection\n');
            } else {
                console.log('⚠️  Error adding sharedWith:', error.message, '\n');
            }
        }

        // 4. Update User Profiles Collection Schema
        console.log('📋 Updating user_profiles collection schema...');
        try {
            await databases.createStringAttribute(APP_DATABASE_ID, 'user_profiles', 'googleProfilePicture', 500, false);
            console.log('✅ Added googleProfilePicture attribute to user_profiles collection\n');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  googleProfilePicture attribute already exists in user_profiles collection\n');
            } else {
                console.log('⚠️  Error adding googleProfilePicture:', error.message, '\n');
            }
        }

        // 5. Create Profile Pictures Storage Bucket
        console.log('📦 Creating profile_pictures storage bucket...');
        try {
            await storage.createBucket(
                'profile_pictures',
                'profile_pictures',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users())
                ],
                false, // fileSecurity
                true,  // enabled
                5242880, // 5MB max file size
                ['jpg', 'jpeg', 'png', 'gif', 'webp'], // allowed extensions
                'gzip', // compression
                true, // encryption
                true  // antivirus
            );
            console.log('✅ Profile pictures storage bucket created\n');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  Profile pictures storage bucket already exists\n');
            } else {
                throw error;
            }
        }

        console.log('🎉 Setup completed successfully!');
        console.log('\n📝 Summary:');
        console.log('   ✓ Friends collection');
        console.log('   ✓ Admin settlements collection');
        console.log('   ✓ Groups collection updated (adminUserId, sharedWith)');
        console.log('   ✓ User profiles collection updated (googleProfilePicture)');
        console.log('   ✓ Profile pictures storage bucket');

    } catch (error) {
        console.error('❌ Error during setup:', error);
        process.exit(1);
    }
}

// Run the setup
setupCollectionsAndStorage();
