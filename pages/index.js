import React from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

const HomePage = (props) => {
  return (
    <React.Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name='description'
          content='Browse a list of highly active React meetups!'
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </React.Fragment>
  );
};

export const getStaticProps = async () => {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/meetups?retryWrites=true&w=majority`
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        description: meetup.description,
        id: meetup._id.toString()
      }))
    },
    revalidate: 1
  };
};

// export const getServerSideProps = (props) => {
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   };
// };

export default HomePage;
