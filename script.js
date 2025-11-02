document.addEventListener('DOMContentLoaded', function(){

    const input = document.getElementById('textInput');
    const button = document.getElementById('addButton');
    const block = document.querySelector('.div1');

    if (!input || !button || !block) {
        console.log('Не найдены asdfaнеобходимые элементы:');
        if (!input) console.log('- textInput');
        if (!button) console.log('- addButton');
        if (!block) console.log('- .div1');
        return;
      }

    function updateButtonVisibility(){ 
        button.style.display = input.value.trim() ? 'block' : 'none';    
      }

    function addTextBlock() {
        const text = input.value.trim();
        if (!text) return; 
        const listElem = document.createElement('p');
        listElem.textContent = text;
        block.append(listElem);

        input.value = '';
        manageParagraphs();
        updateButtonVisibility();
    }


    function manageParagraphs(){
        const allParagraphs = document.querySelectorAll('p')
        const maxParagraphs = 5;
        console.log(allParagraphs.length);
        console.log(maxParagraphs);
        if (allParagraphs.length > maxParagraphs) { allParagraphs[0].remove();}
    }

        updateButtonVisibility();
        manageParagraphs();


        input.addEventListener('input', updateButtonVisibility);
        button.addEventListener('click', addTextBlock);
        input.addEventListener('keydown', function(event) {
          if (event.key === 'Enter'){
            button.click();
          }
        })
});
