const sitePrefix = "https://one360.com.au";

export function transformContentHtml(html: string): string {
  let output = html;

  output = output.replace(/<script[\s\S]*?<\/script>/gi, "");
  output = output.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
  output = output.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");

  output = output.replace(/\sdata-src=/gi, " src=");
  output = output.replace(/\sdata-srcset=/gi, " srcset=");

  output = output.replaceAll(`${sitePrefix}/`, "/");

  return output;
}

export function stripDetailsFromContent(html: string): string {
  return html
    .replace(/<h1[\s\S]*?<\/h1>/gi, "")
    .replace(/<div[^>]*id="instagram-gallery-feed-[^"]*"[\s\S]*?<\/div>/gi, "")
    .replace(/<details[\s\S]*?<\/details>/gi, "");
}
