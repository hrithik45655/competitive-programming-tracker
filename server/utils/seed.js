require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Revision = require('../models/Revision');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    await User.deleteMany({});
    await Problem.deleteMany({});
    await Revision.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    const hashedPassword = await bcrypt.hash('password123', 12);
    const user = await User.create({
      username: 'demo_user',
      email: 'demo@cptracker.com',
      password: hashedPassword,
      avatar: ''
    });
    console.log('👤 Created test user');
    
    const sampleProblems = [
      {
        title: 'Two Sum', platform: 'LeetCode', problemNumber: '1',
        problemUrl: 'https://leetcode.com/problems/two-sum/', difficulty: 'Easy',
        topics: ['Array', 'HashMap'], status: 'Solved', confidence: 'Independent',
        solvedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), timeSpent: 18,
        notes: 'Used HashMap to store previously seen values. O(n) time complexity.'
      },
      {
        title: 'Add Two Numbers', platform: 'LeetCode', problemNumber: '2',
        problemUrl: 'https://leetcode.com/problems/add-two-numbers/', difficulty: 'Medium',
        topics: ['Linked List', 'Math'], status: 'Solved', confidence: 'Hint Needed',
        solvedDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), timeSpent: 35,
        notes: 'Needed hint for carry handling.'
      },
      {
        title: 'Longest Substring Without Repeating Characters', platform: 'LeetCode', problemNumber: '3',
        problemUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', difficulty: 'Medium',
        topics: ['String', 'Sliding Window', 'HashSet'], status: 'Solved', confidence: 'Solution Watched',
        solvedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), timeSpent: 45,
        notes: 'Watched solution for sliding window optimization.'
      },
      {
        title: 'Median of Two Sorted Arrays', platform: 'LeetCode', problemNumber: '4',
        problemUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', difficulty: 'Hard',
        topics: ['Array', 'Binary Search'], status: 'Solved', confidence: 'Solution Watched',
        solvedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), timeSpent: 60,
        notes: 'Very challenging. Binary search on two arrays.'
      },
      {
        title: 'Way Too Long Words', platform: 'Codeforces', problemNumber: '71A',
        problemUrl: 'https://codeforces.com/problemset/problem/71/A', difficulty: 'Easy',
        topics: ['String', 'Math'], status: 'Solved', confidence: 'Independent',
        solvedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), timeSpent: 8,
        notes: 'Simple string manipulation.'
      }
    ];
    
    const problems = await Promise.all(
      sampleProblems.map(async (prob) => {
        return await Problem.create({ ...prob, userId: user._id });
      })
    );
    console.log(`📝 Created ${problems.length} problems`);
    
    const revisions = [];
    for (let i = 0; i < Math.min(10, problems.length); i++) {
      const problem = problems[i];
      const revision = await Revision.create({
        userId: user._id,
        problemId: problem._id,
        revisionNumber: 1,
        confidenceBefore: problem.confidence,
        confidenceAfter: problem.confidence === 'Solution Watched' ? 'Hint Needed' : problem.confidence,
        revisionDate: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000)),
        notes: `Revision #1 for ${problem.title}`
      });
      revisions.push(revision);
      
      problem.revisionCount = 1;
      problem.lastRevisedDate = revision.revisionDate;
      await problem.save();
    }
    console.log(`🔄 Created ${revisions.length} revisions`);
    
    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Test Credentials:');
    console.log('   Email: demo@cptracker.com');
    console.log('   Password: password123\n');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
