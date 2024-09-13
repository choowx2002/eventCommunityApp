import SQLite from 'react-native-sqlite-storage';

// SQLite.DEBUG(true);//will display the action
SQLite.enablePromise(true);

const okCallback = () => {
  console.log('open db success');
};

const errorCallback = () => {
  console.log('open db fail');
};

const connectDB = async () => {
  try {
    const db = await SQLite.openDatabase(
      {
        name: 'EventsDB.db',
        location: 'default',
      },
      okCallback,
      errorCallback,
    );
    return db;
  } catch (error) {
    return null;
  }
};

// create the database and table
export const initSQLiteDB = async () => {
  try {
    const db = await connectDB();
    if (!db) {
      return null;
    }
    // Create table if it doesn't exist
    await db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS joined_events (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          image_path TEXT,
          admin_id INTEGER NOT NULL,
          participants_limit INTEGER,
          address TEXT NOT NULL,
          postcode TEXT NOT NULL,
          state TEXT,
          city TEXT,
          category_id INTEGER,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        );`,
        [],
        () => {
          console.log('Table created successfully');
        },
        error => {
          console.log('Error creating table: ', error);
        },
      );
    });

    return db;
  } catch (error) {
    console.error('Failed to create database and table: ', error);
    return null;
  }
};

export const insertEvent = async event => {
  const db = await connectDB();
  if (!db) {
    return false;
  }

  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO joined_events (
              id,
              title,
              description,
              start_time,
              end_time,
              start_date,
              end_date,
              image_path,
              admin_id,
              participants_limit,
              address,
              postcode,
              state,
              city,
              category_id,
              created_at,
              updated_at,
              deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.id,
          event.title,
          event.desc,
          event.start_time,
          event.end_time,
          event.start_date,
          event.end_date,
          event.image_path,
          event.admin_id,
          event.participants_limit,
          event.address,
          event.postcode,
          event.state,
          event.city,
          event.category_id,
          event.created_at,
          event.updated_at,
          event.deleted_at,
        ],
        () => {
          console.log('Event inserted successfully');
          resolve(true);
        },
        error => {
          console.log('Error inserting event: ', error);
          resolve(false);
        },
      );
    });
  });
};

export const getSubscribeEventsId = async () => {
  const db = await connectDB();
  if (!db) return null;

  const subscribeEvents = [];

  await db.transaction(tx => {
    tx.executeSql(
      `SELECT id FROM joined_events`,
      [],
      (tx, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          subscribeEvents.push(results.rows.item(i).id.toString());
        }
        console.log('Subscribe events:', subscribeEvents);
      },
      error => {
        console.log('Error fetching events:', error);
      },
    );
  });

  return subscribeEvents; // return the subscribed event IDs
};

export const removeEvents = async id => {
  const db = await connectDB();
  if (!db || !id) return null;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM joined_events WHERE id = ?`,
        [id],
        () => {
          console.log('Event removed successfully');
          resolve(true); 
        },
        error => {
          console.log('Error removing event: ', error);
          reject(false);
        },
      );
    });
  });
};

export const removeAllEvents = async () => {
  const db = await connectDB();
  if (!db) return null;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM joined_events`,
        [],
        () => {
          console.log('All events removed successfully');
          resolve(true);
        },
        error => {
          console.log('Error removing events: ', error);
          reject(false);
        },
      );
    });
  });
};

export const checkEventById = async id => {
  const db = await connectDB();
  if (!db || !id) return null;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM joined_events WHERE id = ?`,
        [id],
        (tx, results) => {
          if( results.rows.length>0) resolve({isJoined:true, event: results.rows.item(0)})
          else reject({isJoined:'false'})
        },
        error => {
          console.log('Error get event: ', error);
          reject({isJoined:'false'});
        },
      );
    });
  });
};
