import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/job_aggregator';

const sampleJobs = [
  { title: 'Fullstack Developer', company: 'Spotify' },
  { title: 'Frontend Engineer', company: 'Airbnb' },
  { title: 'Backend Engineer', company: 'Stripe' },
  { title: 'Software Engineer', company: 'Netflix' },
  { title: 'Product Engineer', company: 'Notion' },
];

async function seed(): Promise<void> {
  await mongoose.connect(uri);
  const collection = mongoose.connection.collection('jobs');

  await collection.deleteMany({});
  await collection.insertMany(sampleJobs);

  console.log(`Seeded ${sampleJobs.length} jobs into ${uri}`);
  await mongoose.disconnect();
}

void seed().catch(async (error) => {
  console.error('Failed seeding jobs:', error);
  await mongoose.disconnect();
  process.exit(1);
});
