import * as functions from 'firebase-functions';
import { BigQuery } from '@google-cloud/bigquery';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
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
  response.send(rows)
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
