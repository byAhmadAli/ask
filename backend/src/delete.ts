import { UserApplication } from './application';

export async function deleteData(args: string[]) {
  console.log('deleting data');

  const app = new UserApplication();
  await app.boot();
  await app.deleteData();

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

deleteData(process.argv).catch(err => {
  console.error('Cannot delete', err);
  process.exit(1);
});
