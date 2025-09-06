const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' }
}, { timestamps: true });


userSchema.pre('save', async function(next) {

  if (!this.isModified('password')) return next();
  
  try {
   
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    console.log('🔐 Password hashed successfully');
    next();
  } catch (error) {
    console.error('❌ Password hashing error:', error);
    next(error);
  }
});


userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('🔍 Comparing passwords:');
    console.log('Candidate:', candidatePassword);
    console.log('Stored hash:', this.password);
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Comparison result:', isMatch);
     return await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    return false;
  }
};


userSchema.post('save', function(doc) {
  console.log('💾 User saved to database:');
  console.log('Username:', doc.username);
  console.log('Email:', doc.email);
  console.log('Hashed Password:', doc.password);
});

module.exports = mongoose.model('User', userSchema);