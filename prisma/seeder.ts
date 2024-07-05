import { PrismaClient, MediaType, ApprovalStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.warn("DELETING EXISTING DB DATA");

  await prisma.volunteer.deleteMany();
  await prisma.message.deleteMany();
  await prisma.media.deleteMany();
  await prisma.like.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.article.deleteMany();
  await prisma.cause.deleteMany();
  await prisma.category.deleteMany();

  // Category
  const category1 = await prisma.category.create({
    data: {
      name: "Environment",
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: "Education",
    },
  });

  // Cause
  const cause1 = await prisma.cause.create({
    data: {
      title: "Save the Rainforest",
      description: "A campaign to protect our rainforests from deforestation.",
      targetAmount: 10000,
      categoryId: category1.id,
    },
  });

  const cause2 = await prisma.cause.create({
    data: {
      title: "Support Rural Schools",
      description: "A fund to provide resources for schools in rural areas.",
      targetAmount: 5000,
      categoryId: category2.id,
    },
  });

  // Media
  const media1 = await prisma.media.create({
    data: {
      key: "1234567",
      url: "https://example.com/image1.jpg",
      type: MediaType.IMAGE,
      causeId: cause1.id,
    },
  });

  const media2 = await prisma.media.create({
    data: {
      key: "123456",
      url: "https://example.com/image2.jpg",
      type: MediaType.IMAGE,
      causeId: cause2.id,
    },
  });

  // Approval
  const approval1 = await prisma.approval.create({
    data: {
      approverId: "approver1",
      requesterId: "requester1",
      causeId: cause1.id,
      status: ApprovalStatus.APPROVED,
    },
  });

  const approval2 = await prisma.approval.create({
    data: {
      approverId: "approver2",
      requesterId: "requester2",
      causeId: cause2.id,
      status: ApprovalStatus.APPROVED,
    },
  });

  // Comment
  const comment1 = await prisma.comment.create({
    data: {
      content: "This is a great cause!",
      userId: "user1",
      causeId: cause1.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: "I fully support this initiative.",
      userId: "user2",
      causeId: cause2.id,
    },
  });

  // Like
  const like1 = await prisma.like.create({
    data: {
      userId: "user1",
      commentId: comment1.id,
    },
  });

  const like2 = await prisma.like.create({
    data: {
      userId: "user2",
      commentId: comment2.id,
    },
  });

  // Donation
  const donation1 = await prisma.donation.create({
    data: {
      amount: 100,
      causeId: cause1.id,
      userId: "donor1",
      isAnonymous: false,
    },
  });

  const donation2 = await prisma.donation.create({
    data: {
      amount: 200,
      causeId: cause2.id,
      userId: "donor2",
      isAnonymous: true,
    },
  });

  // Discussion
  const discussion1 = await prisma.discussion.create({
    data: {
      title: "Discussion about Save the Rainforest",
      approvalId: approval1.id,
    },
  });

  const discussion2 = await prisma.discussion.create({
    data: {
      title: "Discussion about Support Rural Schools",
      approvalId: approval2.id,
    },
  });

  // Message
  // const message1 = await prisma.message.create({
  //   data: {
  //     content: 'I think this is a great cause!',
  //     fromUserId: 'user1',
  //     toUserId: 'user2',
  //     discussionId: discussion1.id,
  //   },
  // })

  // const message2 = await prisma.message.create({
  //   data: {
  //     content: 'I agree, we should all support this!',
  //     fromUserId: 'user2',
  //     toUserId: 'user1',
  //     discussionId: discussion2.id,
  //   },
  // })

  // Article
  const article1 = await prisma.article.create({
    data: {
      categoryId: category1.id,
      title: "The Importance of Saving the Rainforest",
      content:
        "This article discusses the importance of saving the rainforest...",
      authorId: "author1",
    },
  });

  const article2 = await prisma.article.create({
    data: {
      categoryId: category2.id,
      title: "The Need for Education in Rural Areas",
      content:
        "This article highlights the need for education in rural areas...",
      authorId: "author2",
    },
  });

  await prisma.media.create({
    data: {
      key: "1234566",
      url: "https://example.com/image1.jpg",
      type: MediaType.IMAGE,
      articleId: article1.id,
    },
  });

  await prisma.media.create({
    data: {
      key: "1234577",
      url: "https://example.com/image2.jpg",
      type: MediaType.IMAGE,
      articleId: article2.id,
    },
  });

  // Volunteer
  const volunteer1 = await prisma.volunteer.create({
    data: {
      approval: { connect: { id: approval1.id } },
      startDate: new Date(),
    },
  });

  const volunteer2 = await prisma.volunteer.create({
    data: {
      approval: { connect: { id: approval1.id } },
      startDate: new Date(),
    },
  });

  // Certificate
  const certificate1 = await prisma.certificate.create({
    data: {
      documentKey: media1.key,
      volunteerId: volunteer1.id,
    },
  });

  const certificate2 = await prisma.certificate.create({
    data: {
      documentKey: media2.key,
      volunteerId: volunteer2.id,
    },
  });

  console.info("Successfully seeded the db.");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
