import { ThreeColumnBlock, TwoColumnBlock } from "@/lib/blocks";
import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  CodeBlock,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title", // Now this will find the field correctly
    defaultColumns: ["title", "updatedAt", "isFeatured", "isHighlighted"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Project Name",
      // Keep it here at the top level, above the tabs
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Project Info",
          fields: [
            {
              name: "projectBehaviour",
              type: "group",
              fields: [
                {
                  name: "slug",
                  admin: {
                    description: "e.g. 'ai-databases'",
                  },
                  type: "text",
                  required: true,
                  unique: true,
                },
                {
                  name: "isFeatured",
                  type: "checkbox",
                  label: "Featured",
                },
                {
                  name: "isHighlighted",
                  type: "checkbox",
                  label: "Highlighted",
                },
              ],
            },
            {
              name: "projectDetails",
              type: "group",
              fields: [
                {
                  name: "featuredImage",
                  type: "upload",
                  relationTo: "media",
                },
                {
                  name: "description",
                  type: "text",
                  label: "Description",
                },
                {
                  name: "overview",
                  type: "richText",
                  label: "Overview",
                  editor: lexicalEditor({
                    features: [
                      BoldFeature(),
                      ItalicFeature(),
                      UnderlineFeature(),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                      AlignFeature(),
                      HeadingFeature({
                        enabledHeadingSizes: ["h3", "h4", "h5"],
                      }),
                      LinkFeature(),
                      BlockquoteFeature(),
                      HorizontalRuleFeature(),
                      OrderedListFeature(),
                      UnorderedListFeature(),
                    ],
                  }),
                },
              ],
            },
            {
              name: "externalLinks",
              type: "array",
              label: "External Links",
              fields: [
                {
                  name: "label",
                  type: "text",
                  required: true,
                  admin: {
                    placeholder: "e.g. View on GitHub",
                  },
                },
                {
                  name: "url",
                  type: "text",
                  required: true,
                },
              ],
            },
            {
              name: "images",
              type: "array",
              label: "Project Gallery",
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                },
              ],
            },
            {
              name: "tags",
              type: "array",
              label: "Project Tags",
              fields: [{ name: "label", type: "text", required: true }],
            },
            {
              name: "technologies",
              type: "array",
              label: "Tech Stack & Tools",
              fields: [{ name: "label", type: "text", required: true }],
            },
          ],
        },
        {
          label: "Article",
          admin: {
            width: "100%",
            description:
              "Optional long-form article, when added to project the page will convert from a Web Project, to a Block-Style Post.",
          },
          fields: [
            {
              name: "projectArticle",
              type: "richText",
              label: "Article Content",
              editor: lexicalEditor({
                features: [
                  BoldFeature(),
                  ItalicFeature(),
                  UnderlineFeature(),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  AlignFeature(),
                  HeadingFeature({
                    enabledHeadingSizes: ["h3", "h4", "h5"],
                  }),
                  LinkFeature(),
                  BlockquoteFeature(),
                  HorizontalRuleFeature(),
                  OrderedListFeature(),
                  UnorderedListFeature(),
                  // This adds the image support
                  UploadFeature({
                    collections: {
                      media: {
                        // This determines which fields are editable when an image is selected
                        fields: [
                          {
                            name: "caption",
                            type: "richText",
                            editor: lexicalEditor(), // Simple editor for captions
                          },
                        ],
                      },
                    },
                  }),
                  BlocksFeature({
                    blocks: [
                      TwoColumnBlock,
                      ThreeColumnBlock,
                      {
                        slug: "Call To Action",
                        fields: [
                          {
                            name: "heading",
                            type: "text",
                            required: true,
                          },
                          {
                            name: "link",
                            type: "text",
                          },
                        ],
                      },
                      CodeBlock({
                        defaultLanguage: "ts",
                        languages: {
                          plaintext: "Plain Text",
                          js: "JavaScript",
                          ts: "TypeScript",
                          tsx: "TSX",
                          jsx: "JSX",
                        },
                      }),
                    ],

                    inlineBlocks: [
                      {
                        slug: "highlight",
                        fields: [
                          {
                            name: "highlightedText",
                            type: "text",
                            required: true,
                          },
                        ],
                      },
                    ],
                  }),
                ],
              }),
            },
          ],
        },
      ],
    },
  ],
};
