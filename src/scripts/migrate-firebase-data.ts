import { firebaseService } from '../services/firebase';

async function migrateData() {
  console.log('Starting migration process...');
  console.log('Step 1: Migrating data from old collection to new collection...');

  try {
    // Migrate data
    const migrationResult = await firebaseService.migrateOldData();
    
    if (migrationResult.success) {
      console.log(`✅ Successfully migrated ${migrationResult.migrated} documents`);
      if (migrationResult.errors > 0) {
        console.warn(`⚠️ ${migrationResult.errors} documents failed to migrate`);
      }
    } else {
      console.error('❌ Migration failed');
      return;
    }

    // Only proceed with cleanup if migration was successful
    if (migrationResult.success && migrationResult.errors === 0) {
      console.log('\nStep 2: Cleaning up old collection...');
      const cleanupResult = await firebaseService.deleteOldCollection();
      
      if (cleanupResult.success) {
        console.log(`✅ Successfully deleted ${cleanupResult.deleted} old documents`);
      } else {
        console.error('❌ Cleanup failed');
      }
    } else {
      console.log('\n⚠️ Skipping cleanup due to migration errors');
    }

    console.log('\nMigration process completed!');
  } catch (error) {
    console.error('❌ Migration failed with error:', error);
  }
}

// Run the migration
migrateData(); 