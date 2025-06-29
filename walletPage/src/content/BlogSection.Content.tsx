import { BlogSectionType } from "@/common/modules/BlogGridItems";
import { PageHeaderType } from "@/common/modules/PageHeader";

export const BlogSectionHeader: PageHeaderType = {
  title: "NextSiders Blog",
  description:
    "Read about the technology, design, history, and business behind NextSiders. If you want to get notified about new posts, subscribe below!",
};

export const BlogSectionContent: BlogSectionType = {
  items: [
    {
      category: "Nextjs",
      title: "The Benefits of Using Next.js for Your Web Development Projects",
      description:
        "Next.js is a powerful tool for web developers that makes building fast, secure, and dynamic web apps much easier.",
      date: "Dec 22, 2022",
      readTime: "2 min read",
      image: {
        src: "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        alt: "Blog Image",
      },
      link: "/blog/example-page",
    },
    {
      category: "Marketing",
      title: "The Benefits of Using Next.js for Your Web Development Projects",
      description:
        "Next.js is a powerful tool for web developers that makes building fast, secure, and dynamic web apps much easier.",
      date: "Dec 21, 2022",
      readTime: "5 min read",
      image: {
        src: "https://images.unsplash.com/photo-1634382615649-7227ce9a5cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
        alt: "Blog Image",
      },
      link: "/blog/example-page",
    },
    {
      category: "Nextjs",
      title: "The Benefits of Using Next.js for Your Web Development Projects",
      description:
        "Next.js is a powerful tool for web developers that makes building fast, secure, and dynamic web apps much easier.",
      date: "Dec 20, 2022",
      readTime: "1 min read",
      image: {
        src: "https://images.unsplash.com/photo-1634382653568-8271aa4956fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
        alt: "Blog Image",
      },
      link: "/blog/example-page",
    },
    {
      category: "SEO",
      title: "The Benefits of Using Next.js for Your Web Development Projects",
      description:
        "Next.js is a powerful tool for web developers that makes building fast, secure, and dynamic web apps much easier.",
      date: "Nov 26, 2022",
      readTime: "4 min read",
      image: {
        src: "https://images.unsplash.com/photo-1633114594701-52002208270f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1010&q=80",
        alt: "Blog Image",
      },
      link: "/blog/example-page",
    },
  ],
};
