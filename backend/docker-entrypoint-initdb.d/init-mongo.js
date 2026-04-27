db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [
    { role: 'readWrite', db: 'calculator' },
    { role: 'dbAdmin', db: 'calculator' }
  ]
});

db = db.getSiblingDB('admin');

db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: ['userAdminAnyDatabase', 'readWriteAnyDatabase']
});