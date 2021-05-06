import React from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'First Meetup',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
    address: 'Some address 5, 12345 Some City',
    description: 'This is a first meetup'
  },
  {
    id: 'm2',
    title: 'Second Meetup',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/2/2d/Taipei_Taiwan_Taipei-101-Tower-01.jpg',
    address: 'Some address 6, 67890 Some City',
    description: 'This is a second meetup'
  }
];

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
    }
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
