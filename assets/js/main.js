const postFiles = [
  { name: 'Welcome', file: 'posts/welcome.md' },
  { name: 'Hack the Planet', file: 'posts/hacktheplanet.md' },
  { name: 'AI Threats', file: 'posts/ai-threats.md' },
  { name: 'Blue Team Guide', file: 'posts/blue-team-guide.md' }
];

// Load and render a Markdown post
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
  updateStats(markdown);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Dropdown logic
function populateDropdown() {
  const selector = document.getElementById('postSelector');
  postFiles.forEach(post => {
    const opt = document.createElement('option');
    opt.value = post.file;
    opt.textContent = post.name;
    selector.appendChild(opt);
  });
}

document.getElementById('postSelector').addEventListener('change', (e) => {
  const selectedPost = e.target.value;
  loadMarkdownPost(selectedPost);
});

// Theme toggle
const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

window.onload = () => {
  populateDropdown();
  loadMarkdownPost('posts/welcome.md');
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
  }
};

// Live Markdown Preview
function previewMarkdown() {
  const input = document.getElementById('markdownInput').value;
  document.getElementById('previewArea').innerHTML = marked.parse(input);
}

// Markdown File Uploader
document.getElementById('uploadMd').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      document.getElementById('blog-container').innerHTML = `
        <article class="prose max-w-4xl mx-auto bg-white text-black p-8 rounded-xl shadow fade-in-up">
          ${marked.parse(content)}
        </article>
      `;
      updateStats(content);
    };
    reader.readAsText(file);
  }
});

// Search filter
document.getElementById('searchInput').addEventListener('input', () => {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const selector = document.getElementById('postSelector');
  selector.innerHTML = '';
  postFiles
    .filter(p => p.name.toLowerCase().includes(query))
    .forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.file;
      opt.textContent = p.name;
      selector.appendChild(opt);
    });
});

// Word count + read time
function updateStats(markdownText) {
  const words = markdownText.trim().split(/\\s+/).length;
  const readTime = Math.ceil(words / 200);
  document.getElementById('stats').innerText = `${words} words • ~${readTime} min read`;
}
