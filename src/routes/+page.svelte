<script lang="ts">
</script>

<main>
	<div class="bg-slate-950 text-slate-300 min-h-screen p-6">
    <header class="mb-4">
      <h1 class="text-orange-500 text-4xl">My Application</h1>
      <nav class="bg-slate-900 p-4 mt-4 rounded">
        <ul class="flex space-x-4">
          <li>
            <a href="#a" class="text-white hover:text-orange-500 focus:underline active:text-purple-500 p-2 rounded">Home</a>
          </li>
          <li>
            <a href="#a" class="text-white hover:text-orange-500 focus:underline active:text-purple-500 p-2 rounded">About</a>
          </li>
          <li>
            <a href="#a" class="text-white hover:text-orange-500 focus:underline active:text-purple-500 p-2 rounded">Services</a>
          </li>
          <li>
            <a href="#a" class="text-white hover:text-orange-500 focus:underline active:text-purple-500 p-2 rounded">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  
    <main>
      <section class="bg-slate-800 p-4 rounded mb-4">
        <h2 class="text-slate-300">Main Content</h2>
        <p>This section uses the secondary color for its background.</p>
        <button class="bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 active:bg-orange-700 text-white p-2 rounded mb-4">
          Important Action
        </button>
        <button class="bg-purple-500 hover:bg-purple-600 focus:ring-2 focus:ring-purple-400 active:bg-purple-700 text-white p-2 rounded mb-4">
          Another Action
        </button>
      </section>
  
      <!-- Separator -->
      <div class="bg-slate-900 text-slate-300 py-4">
        <div class="border-t border-slate-700"></div>
      </div>
  
      <section class="bg-slate-900 p-4 rounded mb-4">
        <h2 class="text-slate-300">Another Section</h2>
        <p>This section continues with the primary color for its background.</p>
        <select class="bg-slate-700 text-white hover:bg-slate-600 focus:ring-2 focus:ring-slate-500 placeholder-slate-400 p-2 rounded mb-4">
          <option value="" disabled selected class="text-slate-400">Select an option</option>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </select>
      </section>
    </main>
  
    <footer class="bg-slate-700 p-4 mt-4 rounded">
      <p>Footer content here. Use lighter background colors for less prominent sections.</p>
    </footer>
  </div>
</main>
