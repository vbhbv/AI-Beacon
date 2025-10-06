// نقوم بتحميل البيانات من ملف data.json
let aiTools = [];
const listContainer = document.getElementById('tools-list');
const filterSelect = document.getElementById('category-filter');
const searchInput = document.getElementById('search-input');

fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        aiTools = data;
        loadTools();
    })
    .catch(error => {
        console.error('Failed to load AI tools data:', error);
        listContainer.innerHTML = '<p class="error-message" style="text-align: center; color: red;">تعذر تحميل بيانات الأدوات. يرجى التأكد من مسار ملف data.json.</p>';
    });


// 1. الدالة الأساسية لتحميل الأدوات وعناصر التحكم
function loadTools() {
    listContainer.innerHTML = ''; 
    const categories = new Set(["All"]); 

    aiTools.forEach(tool => {
        categories.add(tool.category_ar);

        // تجميع جميع مصطلحات البحث باللغتين لتحقيق أقصى قدر من الدقة
        const searchContent = `${tool.name_ar} ${tool.name_en} ${tool.description_ar} ${tool.description_en} ${tool.tags.join(' ')} ${tool.keywords_seo}`;

        // بناء بطاقة الأداة (Card HTML)
        const cardHTML = `
            <div class="tool-card" 
                 data-category="${tool.category_ar}" 
                 data-search-content="${searchContent.toLowerCase()}"
                 data-model="${tool.priceModel}">
                
                <h2><a href="${tool.link}" target="_blank">${tool.name_ar} (${tool.name_en})</a></h2>
                <p class="description">${tool.description_ar}</p>
                
                <p class="meta">
                    <span class="category-tag">${tool.category_ar}</span>
                    <span class="price-tag" data-model="${tool.priceModel}">${tool.priceModel}</span>
                </p>
                <p class="tags">
                    ${tool.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
                </p>
            </div>
        `;
        listContainer.innerHTML += cardHTML;
    });

    // تعبئة قائمة الفلاتر المنسدلة
    categories.forEach(category => {
        if (category !== "All") {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterSelect.appendChild(option);
        }
    });
}

// 2. الدالة الموحدة للبحث والتصفية الفورية
function filterTools() {
    const selectedCategory = filterSelect.value;
    const searchQuery = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.tool-card');
    let resultsFound = 0;

    cards.forEach(card => {
        const toolCategory = card.getAttribute('data-category');
        const searchContent = card.getAttribute('data-search-content'); 

        // الشرط 1: مطابقة الفئة
        const matchesCategory = (selectedCategory === "All" || toolCategory === selectedCategory);

        // الشرط 2: مطابقة نص البحث
        const matchesSearch = (!searchQuery || searchContent.includes(searchQuery));

        // إظهار البطاقة إذا تم استيفاء كلا الشرطين
        if (matchesCategory && matchesSearch) {
            card.style.display = 'block';
            resultsFound++;
        } else {
            card.style.display = 'none';
        }
    });

    // إضافة رسالة "لم يتم العثور على نتائج"
    const noResultsMessage = document.getElementById('no-results');
    if (resultsFound === 0) {
        if (!noResultsMessage) {
            const message = document.createElement('p');
            message.id = 'no-results';
            message.textContent = `عفواً، لم يتم العثور على نتائج مطابقة لـ "${searchQuery}".`;
            message.style.cssText = 'text-align: center; font-size: 1.2em; color: #e74c3c; padding: 20px;';
            listContainer.parentNode.insertBefore(message, listContainer);
        } else {
             noResultsMessage.textContent = `عفواً، لم يتم العثور على نتائج مطابقة لـ "${searchQuery}".`;
        }
        listContainer.style.display = 'none';
    } else {
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
        listContainer.style.display = 'grid';
    }
}
