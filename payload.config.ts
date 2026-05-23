import sharp from "sharp";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { HomeContent } from "./collections/HomeContent.ts";
import { Media } from "./collections/Media.ts";
import { Projects } from "./collections/Projects.ts";
import { ProjectsContent } from "./collections/ProjectsContent.ts";
import { Users } from "./collections/Users.ts";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [HomeContent, Projects, ProjectsContent, Media, Users],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || "",
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "", // Use the URI from Neon
    },
  }),
  email: nodemailerAdapter({
    defaultFromAddress: "ryanbakkerdev@gmail.com",
    defaultFromName: "Ryan",
    // By not providing transport options, it stays in "log to console" mode
    // but satisfies Payload that an adapter is present.
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        // Change this part right here:
        media: {
          disablePayloadAccessControl: true,
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
});
