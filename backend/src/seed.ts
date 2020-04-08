import { UserApplication } from './application';

export async function seed(args: string[]) {
  console.log('seeding data');

  const app = new UserApplication();
  await app.boot();
  await app.seedData();

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

seed(process.argv).catch(err => {
  console.error('Cannot seed', err);
  process.exit(1);
});
