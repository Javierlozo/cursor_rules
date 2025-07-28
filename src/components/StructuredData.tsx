"use client";

import { useEffect } from "react";

interface StructuredDataProps {
  type: "website" | "article" | "organization";
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[data-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', 'true');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data]);

  return null;
}

// Website structured data
export function WebsiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cursor Rules Hub",
    "description": "An independent community platform for sharing and discovering Cursor AI coding rules. Built by developers, for developers.",
    "url": "https://cursor-rules-hub.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://cursor-rules-hub.vercel.app/cursor-rules?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Cursor Rules Community",
      "url": "https://cursor-rules-hub.vercel.app"
    }
  };

  return <StructuredData type="website" data={data} />;
}

// Article structured data for individual rules
export function ArticleStructuredData({ rule }: { rule: any }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": rule.name,
    "description": rule.description || `Cursor AI rule: ${rule.name}`,
    "author": {
      "@type": "Person",
      "name": rule.created_by || "Anonymous"
    },
    "datePublished": rule.created_at,
    "dateModified": rule.updated_at || rule.created_at,
    "publisher": {
      "@type": "Organization",
      "name": "Cursor Rules Hub",
      "url": "https://cursor-rules-hub.vercel.app"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://cursor-rules-hub.vercel.app/cursor-rules/${rule.id}`
    },
    "keywords": [
      "cursor rule",
      rule.name.toLowerCase(),
      rule.pattern?.toLowerCase() || "",
      rule.framework?.toLowerCase() || "",
      rule.category?.toLowerCase() || "",
    ].filter(Boolean).join(", "),
    "articleBody": rule.rule_content,
    "codeRepository": "https://github.com/cursor-rules-community",
    "programmingLanguage": rule.framework || "General"
  };

  return <StructuredData type="article" data={data} />;
}

// Organization structured data
export function OrganizationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cursor Rules Hub",
    "description": "An independent community platform for sharing and discovering Cursor AI coding rules",
    "url": "https://cursor-rules-hub.vercel.app",
    "logo": "https://cursor-rules-hub.vercel.app/logo.png",
    "sameAs": [
      "https://github.com/cursor-rules-community",
      "https://twitter.com/cursorrules"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://cursor-rules-hub.vercel.app/feedback"
    }
  };

  return <StructuredData type="organization" data={data} />;
} 