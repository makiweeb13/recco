const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password1!', 10);

  await prisma.commentdislikes.deleteMany();
  await prisma.commentlikes.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.postdislikes.deleteMany();
  await prisma.postlikes.deleteMany();
  await prisma.postgenres.deleteMany();
  await prisma.postmediums.deleteMany();
  await prisma.posts.deleteMany();
  await prisma.users.deleteMany();

  const genreData = [
    { id: 1, name: 'Action' }, { id: 2, name: 'Adventure' },
    { id: 3, name: 'Comedy' }, { id: 4, name: 'Drama' },
    { id: 5, name: 'Fantasy' }, { id: 6, name: 'Horror' },
    { id: 7, name: 'Mystery' }, { id: 8, name: 'Romance' },
    { id: 9, name: 'Sci-Fi' }, { id: 10, name: 'Thriller' },
    { id: 11, name: 'Supernatural' }, { id: 12, name: 'Psychological' },
    { id: 13, name: 'Historical' },
  ];
  for (const g of genreData) {
    await prisma.genres.upsert({ where: { id: g.id }, update: { name: g.name }, create: g });
  }

  const mediumData = [
    { id: 1, name: 'Movie' }, { id: 2, name: 'Anime' },
    { id: 3, name: 'Manga' }, { id: 4, name: 'Novel' },
    { id: 5, name: 'Comic' }, { id: 6, name: 'TV Show' },
    { id: 7, name: 'Video Game' }, { id: 8, name: 'Webtoon' },
    { id: 9, name: 'Light Novel' }, { id: 10, name: 'TV Series' },
    { id: 11, name: 'Movie Series' },
  ];
  for (const m of mediumData) {
    await prisma.mediums.upsert({ where: { id: m.id }, update: { name: m.name }, create: m });
  }

  const alice = await prisma.users.create({
    data: { username: 'alice', email: 'alice@example.com', password, bio: 'Movie and anime enthusiast' },
  });
  const bob = await prisma.users.create({
    data: { username: 'bob', email: 'bob@example.com', password, bio: 'Gamer and bookworm' },
  });

  const p1 = await prisma.posts.create({
    data: { user_id: alice.id, title: 'Inception - A Masterpiece', rate: 9, status: true,
      synopsis: 'A thief steals corporate secrets through dream-sharing tech.',
      review: 'Christopher Nolan at his finest. Stunning visuals and layered storytelling.' },
  });
  await prisma.postgenres.createMany({ data: [{ post_id: p1.id, genre_id: 1 }, { post_id: p1.id, genre_id: 9 }, { post_id: p1.id, genre_id: 10 }] });
  await prisma.postmediums.createMany({ data: [{ post_id: p1.id, medium_id: 1 }, { post_id: p1.id, medium_id: 11 }] });

  const p2 = await prisma.posts.create({
    data: { user_id: alice.id, title: 'The Name of the Wind', rate: 10, status: false,
      synopsis: 'Kvothe recounts his extraordinary life story.',
      review: 'Patrick Rothfuss weaves magic with words. Beautiful prose and gripping journey.' },
  });
  await prisma.postgenres.createMany({ data: [{ post_id: p2.id, genre_id: 5 }, { post_id: p2.id, genre_id: 2 }, { post_id: p2.id, genre_id: 4 }] });
  await prisma.postmediums.createMany({ data: [{ post_id: p2.id, medium_id: 4 }] });

  const p3 = await prisma.posts.create({
    data: { user_id: bob.id, title: 'Attack on Titan - Final Season', rate: 10, status: true,
      synopsis: 'Humans fight for survival against giant humanoid Titans.',
      review: 'A masterpiece of storytelling. Incredible character development.' },
  });
  await prisma.postgenres.createMany({ data: [{ post_id: p3.id, genre_id: 1 }, { post_id: p3.id, genre_id: 4 }, { post_id: p3.id, genre_id: 12 }] });
  await prisma.postmediums.createMany({ data: [{ post_id: p3.id, medium_id: 2 }, { post_id: p3.id, medium_id: 10 }] });

  const p4 = await prisma.posts.create({
    data: { user_id: bob.id, title: 'Elden Ring', rate: 9, status: true,
      synopsis: 'A Tarnished explores the Lands Between to become Elden Lord.',
      review: 'FromSoftware magnum opus. Breathtaking world and rewarding combat.' },
  });
  await prisma.postgenres.createMany({ data: [{ post_id: p4.id, genre_id: 1 }, { post_id: p4.id, genre_id: 5 }, { post_id: p4.id, genre_id: 2 }] });
  await prisma.postmediums.createMany({ data: [{ post_id: p4.id, medium_id: 7 }] });

  await prisma.postlikes.create({ data: { post_id: p1.id, user_id: bob.id } });
  await prisma.postdislikes.create({ data: { post_id: p2.id, user_id: bob.id } });
  await prisma.postlikes.create({ data: { post_id: p3.id, user_id: alice.id } });
  await prisma.postlikes.create({ data: { post_id: p4.id, user_id: alice.id } });
  await prisma.postlikes.create({ data: { post_id: p4.id, user_id: bob.id } });

  const c1 = await prisma.comments.create({
    data: { post_id: p1.id, user_id: bob.id, content: 'Totally agree! The dream within a dream concept blew my mind.' },
  });
  await prisma.comments.create({
    data: { post_id: p1.id, user_id: alice.id, parent_id: c1.id, content: 'Right? The spinning top ending still haunts me.' },
  });
  const c3 = await prisma.comments.create({
    data: { post_id: p3.id, user_id: alice.id, content: 'The final season was absolutely incredible. That ending!' },
  });
  await prisma.comments.create({
    data: { post_id: p3.id, user_id: bob.id, parent_id: c3.id, content: 'I know! I was not ready for those reveals.' },
  });
  await prisma.comments.create({
    data: { post_id: p4.id, user_id: alice.id, content: 'Which boss gave you the most trouble? Mine was Malenia.' },
  });
  await prisma.comments.create({
    data: { post_id: p4.id, user_id: bob.id, content: 'Definitely Malenia. She took me over 50 tries.' },
  });

  // Comment likes
  await prisma.commentlikes.create({ data: { comment_id: c1.id, user_id: alice.id } });
  await prisma.commentlikes.create({ data: { comment_id: c1.id, user_id: bob.id } });
  await prisma.commentlikes.create({ data: { comment_id: c3.id, user_id: bob.id } });

  console.log('Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
