import * as functions from 'firebase-functions';
import { BigQuery, Dataset, Table, TableMetadata, TableField } from '@google-cloud/bigquery';

const DATASET_ID = 'mixidea_data';
const TABLE_ID = 'client_log';

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const createTable = functions.https.onRequest(async(request, response) => {
  const bigquery = new BigQuery();

  let targetDataset: Dataset | null = null;

  const [datasets] = await bigquery.getDatasets();
  console.log('Datasets:');
  datasets.forEach(dataset => {
    console.log(`  ${dataset.id}`);
    if (dataset.id === DATASET_ID) {
      targetDataset = dataset;
    }
  });

  if (! targetDataset) {
    const options = {
      location: 'US',
    };
    const [dataset] = await bigquery.createDataset(DATASET_ID, options);
    console.log(`Dataset Created: ${dataset.id}`);
    targetDataset = dataset;
  }

  let targetTable: Table | null = null;
  const [tables] = await targetDataset.getTables();
  console.log('Tables:');
  tables.forEach(table => {
    console.log(`  ${table.id}`);
    if (table.id === TABLE_ID) {
      targetTable = table;
    }
  });
  if (! targetTable) {
    const schema: TableField[] = [
      { name: 'level', type: 'STRING' },
      { name: 'user_name', type: 'STRING' },
      { name: 'file_name', type: 'STRING' },
      { name: 'message', type: 'STRING' },
      { name: 'type', type: 'STRING' },
      { name: 'server_time', type: 'TIMESTAMP', mode: 'REQUIRED'},
      { name: 'client_time', type: 'TIMESTAMP', mode: 'REQUIRED'},
      { name: 'event_id', type: 'STRING' },
      { name: 'user_id', type: 'STRING' },
      { name: 'tech', type: 'STRING' },
      { name: 'module', type: 'STRING' },
      { name: 'element', type: 'STRING' },
      { name: 'send_type', type: 'STRING' },
      { name: 'browser', type: 'STRING' },
      { name: 'useragent', type: 'STRING' },
      { name: 'trace', type: 'STRING' }
    ];
    const timePartitioning = {
      field: 'server_time',
      type: 'DAY'
    };
    const options: TableMetadata = {
      schema: schema,
      timePartitioning: timePartitioning
    };
    const [table] = await targetDataset.createTable(TABLE_ID, options);
    console.log(`Table Created: ${table.id}`);
    targetTable = table;
  }
  response.send(`Dataset: ${targetDataset.id}, Table: ${targetTable.id}`);
});

export const getClientLog = functions.https.onRequest(async(request, response) => {
  const bigqueryClient = new BigQuery();
  const user_id = request.query.user_id;

  const sqlQuery = `SELECT
     * 
    FROM \`bigquery-219510.client_log.client_log\`
    WHERE user_id = '${ user_id }'
    LIMIT 10`;

  const options = {
    query: sqlQuery
  };

  // Run the query
  const [rows] = await bigqueryClient.query(options);

  console.log(`Query Results: ${rows}`);
  rows.forEach(row => {
    const user_name = row['user_name'];
    const message = row['message'];
    const output = `${user_name}, ${message}`;
    console.log(output);
  });
  response.send(rows);
});

/*
export const queryStackOverflow = functions.https.onRequest(async(request, response) => {
  const bigqueryClient = new BigQuery();

  // The SQL query to run
  const sqlQuery = `SELECT
  CONCAT(
   'https://stackoverflow.com/questions/',
   CAST(id as STRING)) as url,
  view_count
  FROM \`bigquery-public-data.stackoverflow.posts_questions\`
  WHERE tags like '%google-bigquery%'
  ORDER BY view_count DESC
  LIMIT 10`;

  const options = {
    query: sqlQuery,
    location: 'US',
  };

  // Run the query
  const [rows] = await bigqueryClient.query(options);

  console.log('Query Results:');
  rows.forEach(row => {
    const url = row['url'];
    const viewCount = row['view_count'];
    const message = `url: ${url}, ${viewCount} views`;
    console.log(message);
    response.send(message);
  });
});
*/
