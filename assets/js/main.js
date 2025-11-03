// Load Markdown file dynamically and inject into DOM
async function loadMarkdownPost(filePath) {
  const response = await fetch(filePath);
  const markdown = await response.text();
  const html = marked.parse(markdown);
  const container = document.getElementById('blog-container');

  container.innerHTML = `
    <article class="prose lg:prose-xl max-w-4xl mx-auto bg-white text-gray-900 p-8 rounded-xl shadow-lg fade-in-up">
      ${html}
    </article>
  `;
}

// Load first blog post
loadMarkdownPost('posts/welcome.md');
