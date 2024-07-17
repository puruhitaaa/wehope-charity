## Description

wehope is a web application designed to gather charity for multiple causes. It leverages modern web technologies to provide a seamless experience for donors and organizers alike.

## Features

- **User Authentication & Management**: Powered by Clerk for secure and easy user authentication.
- **Form Handling**: Utilizes React Hook Form for efficient form validation and management.
- **Database Management**: Prisma ORM to interact with the database seamlessly.
- **UI Components**: Radix UI and Lucide React for highly customizable and accessible components.
- **Animations**: Framer Motion and React Spring for smooth animations.
- **Carousel**: Embla Carousel for creating carousels and sliders.
- **Email Sending**: Resend to handle transactional emails.
- **Rate Limiting and Caching**: Upstash for Redis-based rate limiting and caching.
- **File Uploads**: Uploadthing for easy file upload handling.
- **Form Validation**: Zod for schema validation.
- **Themes**: Next Themes for dark mode and theme switching.

## Scripts

- **Development Server**: `npm run dev`  
  Start the Next.js development server.

- **Build**: `npm run build`  
  Create an optimized production build of the application.

- **Post-install**: `npm run postinstall`  
  Generate Prisma client after dependencies installation.

- **Start**: `npm run start`  
  Start the Next.js production server.

- **Lint**: `npm run lint`  
  Run ESLint to find and fix problems in your code.

- **Database Generate**: `npm run db:generate`  
  Generate Prisma client based on the schema.

- **Database Migrate**: `npm run db:migrate`  
  Apply database migrations in development.

- **Database Studio**: `npm run db:studio`  
  Open Prisma Studio to interact with the database.

- **Database Push**: `npm run db:push`  
  Push Prisma schema changes to the database without generating migration files.

- **Database Seed**: `npm run db:seed`  
  Run the seed script to populate the database with initial data.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
