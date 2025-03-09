const bcrypt = require('bcryptjs');

const storedHash = "$2a$10$zX8k5p1Qw9j2m3n4o5p6r7s8t9u0v1w2x3y4z5A6B7C8D9E0F1G2H"; // Replace with your hash
const password = "prasadkharate";

bcrypt.compare(password, storedHash, (err, result) => {
  if (err) console.log(err);
  console.log('Password match:', result); // Should print "true"
});

