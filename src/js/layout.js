window.addEventListener('DOMContentLoaded', (event) => {

    const editorContainer = document.getElementById('editor-container');
    const layoutSelect = document.getElementById('layout-select');
    const goldenLayoutSelectV = document.getElementById('golden-layout-select-vertical');
    const goldenLayoutSelectH = document.getElementById('golden-layout-select-horizontal');

    layoutSelect.addEventListener('change', () => {
        const layoutValue = layoutSelect.value;

        if (layoutValue === 'leftright') {
            editorContainer.innerHTML = `
                <div class="editor left selected"></div>
                <div class="editor right"></div>
              `;
        } else if (layoutValue === 'topbottom') {
            editorContainer.innerHTML = `
                <div class="editor top selected"></div>
                <div class="editor bottom"></div>
              `;
        } else if (layoutValue === 'top3') {
            editorContainer.innerHTML = `
                <div class="editor top3_1 selected"></div>
                <div class="editor top3_2"></div>
                <div class="editor top3_3"></div>
              `;
        } else if (layoutValue === 'bottom3') {
            editorContainer.innerHTML = `
                <div class="editor bottom3_1 selected"></div>
                <div class="editor bottom3_2"></div>
                <div class="editor bottom3_3"></div>
              `;
        } else if (layoutValue === 'left3') {
            editorContainer.innerHTML = `
                <div class="editor left3_1 selected"></div>
                <div class="editor left3_2"></div>
                <div class="editor left3_3"></div>
              `;
        } else if (layoutValue === 'right3') {
            editorContainer.innerHTML = `
                <div class="editor right3_1 selected"></div>
                <div class="editor right3_2"></div>
                <div class="editor right3_3"></div>
              `;
        } else if (layoutValue === 'all4') {
            editorContainer.innerHTML = `
                <div class="editor all4_1 selected"></div>
                <div class="editor all4_2"></div>
                <div class="editor all4_3"></div>
                <div class="editor all4_4"></div>
              `;
        }

        // 重新监听
        relocateEditor()
    });

    goldenLayoutSelectV.addEventListener('change', () => {
        const val = goldenLayoutSelectV.value;

        if (val === 'goldVTop') {
            editorContainer.innerHTML = `
            <div class="editor goldVTop_1 selected"></div>
            <div class="editor goldVTop_2"></div>
          `
        } else if (val === 'goldVBottom') {
            editorContainer.innerHTML = `
            <div class="editor goldVBottom_1 selected"></div>
            <div class="editor goldVBottom_2"></div>
          `
        }

        // 重新监听
        relocateEditor()
    });

    goldenLayoutSelectH.addEventListener('change', () => {
        const val = goldenLayoutSelectH.value;

        if (val === 'goldHLeft') {
            editorContainer.innerHTML = `
            <div class="editor goldHLeft_1 selected"></div>
            <div class="editor goldHLeft_2"></div>
          `
        } else if (val === 'goldHRight') {
            editorContainer.innerHTML = `
            <div class="editor goldHRight_1 selected"></div>
            <div class="editor goldHRight_2"></div>
          `
        }

        // 重新监听
        relocateEditor()
    });
});

function relocateEditor() {
    var editors = document.querySelectorAll('.editor');
    var selectedEditor = editors[0];
    editors.forEach((editor) => {
        editor.addEventListener('click', () => {
            selectedEditor = editor;
            editors.forEach((editor) => {
                editor.classList.remove('selected');
            });
            editor.classList.add('selected');
            console.log('选择')
        });
        console.log('选择编辑区')
    });
}