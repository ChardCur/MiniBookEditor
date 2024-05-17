window.addEventListener('DOMContentLoaded', (event) => {
  const imageUpload = document.getElementById('image-upload');
  const textInput = document.getElementById('text-input');
  const addTextButton = document.getElementById('add-text-button');
  const textArea = document.getElementById('text-area');
  // const editors = document.querySelectorAll('.editor');
  // let selectedEditor = editors[0];
  const marginSlider = document.getElementById('margin-slider');
  const marginInput = document.getElementById('margin-input');

  const colorInput = document.getElementById('color-input');
  const editorContainer = document.getElementById('editor-container');
  // const layoutSelect = document.getElementById('layout-select');
  // const goldenLayoutSelect = document.getElementById('golden-layout-select');

  // 获取预览按钮和下载按钮
  const previewBtn = document.getElementById('previewBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  // 获取弹窗、关闭按钮和预览内容容器
  const modal = document.getElementById('previewModal');
  const closeBtn = document.getElementsByClassName('close')[0];
  const previewContent = document.getElementById('previewContent');

  adjustContentHeight();
  changeSafariButtonsSize();

  imageUpload.addEventListener('change', (event) => {
    var selEditor = getSelectedEditor();

    const file = event.target.files[0];
    imageUpload.value = '';

    const reader = new FileReader();
    reader.onload = function (e) {
      const image = document.createElement('img');
      image.src = e.target.result;
      selEditor.innerHTML = '';
      selEditor.appendChild(image);
    }

    reader.readAsDataURL(file);
    // console.log('图片上传')
  });

  addTextButton.addEventListener('click', (event) => {
    var selEditor = getSelectedEditor();
    var text = textArea.value;
    var formattedText = text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;'); // 将换行符替换为<br>标签

    const spanTag = document.createElement('span');
    spanTag.innerHTML = formattedText;
    selEditor.innerHTML = '';
    selEditor.appendChild(spanTag);

    // 恢复默认状态
    textStyles.reDefault();

    const fontSelect = document.getElementById('text-fontsize-select');
    const alignmentSelect = document.getElementById('text-alignment-select');
    const lineHeightSelect = document.getElementById('text-lineheight-select');

    fontSelect.selectedIndex = 0;
    alignmentSelect.selectedIndex = 0;
    lineHeightSelect.selectedIndex = 0;
  })

  marginSlider.addEventListener('input', () => {
    var selEditor = getSelectedEditor();
    const maxSliderLength = selEditor.offsetWidth / 2;
    const marginValue = Math.min(marginSlider.value, maxSliderLength);
    marginInput.value = marginValue;
    selEditor.style.setProperty('--image-padding', `${marginValue}px`);
  });

  marginInput.addEventListener('input', () => {
    var selEditor = getSelectedEditor();
    const maxSliderLength = selEditor.offsetWidth / 2;
    const marginValue = Math.min(marginInput.value, maxSliderLength);
    marginSlider.value = marginValue;
    selEditor.style.setProperty('--image-padding', `${marginValue}px`);
  });

  colorInput.addEventListener('input', () => {
    const colorValue = colorInput.value;
    editorContainer.style.setProperty('--background-color', colorValue);
  });

  // Set default margin value to 0
  marginSlider.value = 0;
  marginInput.value = 0;

  var editors = document.querySelectorAll('.editor');
  var selectedEditor = editors[0];
  editors.forEach((editor) => {
    editor.addEventListener('click', () => {
      selectedEditor = editor;
      editors.forEach((editor) => {
        editor.classList.remove('selected');
      });
      editor.classList.add('selected');
      // console.log('默认选择')
    });
    // console.log('默认选择编辑区')
  });

  // 预览功能
  previewBtn.addEventListener('click', () => {
    // 获取editor-container的背景颜色
    const editorContainer = document.getElementById('editor-container');
    const backgroundColor = window.getComputedStyle(editorContainer).getPropertyValue('background-color');

    // 将editor-container区域的内容复制到预览内容容器中
    previewContent.innerHTML = editorContainer.innerHTML;
    // 设置预览内容容器的背景颜色
    previewContent.style.backgroundColor = backgroundColor;
    previewContent.style.border = '0';
    previewContent.style.width = editorContainer.style.width;
    previewContent.style.height = editorContainer.style.height;

    // 先清空布局
    previewContent.classList.forEach((className) => {
      previewContent.classList.remove(className);
    });

    editorContainer.classList.forEach((className) => {
      previewContent.classList.add(className);
    });

    // 移除复制内容中选择区域的边框样式
    const selectedElements = previewContent.querySelectorAll('.editor.selected');
    selectedElements.forEach((element) => {
      element.style.border = '0';
    });

    // 显示弹窗
    modal.style.display = 'block';
  });

  // 关闭弹窗
  closeBtn.addEventListener('click', () => {
    //清空预览内容 避免造成冲突
    previewContent.innerHTML = '';
    modal.style.display = 'none';
  });

  // 创建一个新的canvas元素
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // 下载功能
  downloadBtn.addEventListener('click', () => {

    // 设置canvas的宽度和高度
    canvas.width = previewContent.offsetWidth;
    canvas.height = previewContent.offsetHeight;

    // console.log('点击了下载')
    // 将editor-container区域的内容绘制到canvas上
    html2canvas(previewContent).then((canvas) => {
      // console.log(canvas)

      // 获取当前时间
      const timestamp = Date.now();

      // 创建一个临时链接来下载图片
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `image_${timestamp}.png`;
      link.click();
    });
  });

});

function getSelectedEditor() {
  var selEditor;
  var editors = document.querySelectorAll('.editor');
  editors.forEach((editor) => {
    if (editor.classList.contains('selected')) {
      selEditor = editor;
    }
  });
  return selEditor;
}

function changeAlignment(value) {
  var selEditor = getSelectedEditor();
  var aligment;
  if (value === "center") {
    aligment = "center";
  } else if (value === "right") {
    aligment = "right";
  } else if (value === "left") {
    aligment = "left";
  }
  selEditor.style.setProperty('--span-align', aligment);
}

// 修改画布大小
function changeCanvasSize(layoutType, width, height) {
  var layout = document.getElementById('layout-control');
  var goldenLayoutV = document.getElementById('golden-layout-control-vertical');
  var goldenLayoutH = document.getElementById('golden-layout-control-horizontal');
  var editorContainer = document.getElementById('editor-container');

  editorContainer.innerHTML = '';

  // select
  const layoutSelect = document.getElementById('layout-select');
  const goldenLayoutSelectV = document.getElementById('golden-layout-select-vertical');
  const goldenLayoutSelectH = document.getElementById('golden-layout-select-horizontal');

  // 修改画布大小
  editorContainer.style.width = width;
  editorContainer.style.height = height;

  // 创建 change 事件 触发select事件
  var changeEvent = new Event("change");

  // 替换排版选项
  if (layoutType === 'square') {
    layout.classList.remove('hidden');
    goldenLayoutV.classList.add('hidden');
    goldenLayoutH.classList.add('hidden');

    editorContainer.classList.add('editor-container-grid');
    editorContainer.classList.remove('editor-container-flex-v');
    editorContainer.classList.remove('editor-container-flex-h');

    layoutSelect.selectedIndex = 0;
    layoutSelect.dispatchEvent(changeEvent);
  } else if (layoutType === 'vertical') {
    layout.classList.add('hidden');
    goldenLayoutV.classList.remove('hidden');
    goldenLayoutH.classList.add('hidden');

    editorContainer.classList.remove('editor-container-grid');
    editorContainer.classList.add('editor-container-flex-v');
    editorContainer.classList.remove('editor-container-flex-h');

    goldenLayoutSelectV.selectedIndex = 0;
    goldenLayoutSelectV.dispatchEvent(changeEvent);
  } else if (layoutType === 'horizontal') {
    layout.classList.add('hidden');
    goldenLayoutV.classList.add('hidden');
    goldenLayoutH.classList.remove('hidden');

    editorContainer.classList.remove('editor-container-grid');
    editorContainer.classList.remove('editor-container-flex-v');
    editorContainer.classList.add('editor-container-flex-h');

    goldenLayoutSelectH.selectedIndex = 0;
    goldenLayoutSelectH.dispatchEvent(changeEvent);
  }

  adjustContentHeight();
}

let textStyles = {
  bold: false,
  fontSize: '13px',
  underline: false,
  lineHeight: '18.5px',
  color: 'black',

  reDefault: function () {
    this.bold = false;
    this.fontSize = '13px';
    this.underline = false;
    this.lineHeight = '18.5px';
    this.color = 'black';
  }
};

function makeBold() {
  textStyles.bold = !textStyles.bold;
  applyStyles();
}

function makeDecoration() {
  textStyles.underline = !textStyles.underline;
  applyStyles();
}

function changeFontSize(fontSize) {
  textStyles.fontSize = fontSize;
  applyStyles();
}

function changeLineHeight(lineHeight) {
  textStyles.lineHeight = lineHeight;
  applyStyles();
}

function textColorChange(event) {
  textStyles.color = event.target.value;
  applyStyles();
}

function applyStyles() {
  var selEditor = getSelectedEditor();
  var spans = selEditor.querySelectorAll('span');

  spans.forEach(function (span) {
    span.style.fontWeight = textStyles.bold ? 'bold' : 'normal';
    span.style.fontSize = textStyles.fontSize;
    span.style.lineHeight = textStyles.lineHeight;
    span.style.textDecoration = textStyles.underline ? 'underline' : 'none';
    span.style.color = textStyles.color;
  });
}

function adjustContentHeight() {
  var parent = document.getElementById('editor-work');
  var children = parent.children;
  var totalHeight = 0;

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    totalHeight += child.offsetHeight;
  }

  // 计算子元素间隙的高度
  var gapHeight = (children.length - 1) * parseInt(getComputedStyle(children[0]).marginBottom);
  // 计算父元素的 padding 高度
  var paddingTop = parseInt(getComputedStyle(parent).paddingTop);
  var paddingBottom = parseInt(getComputedStyle(parent).paddingBottom);
  var paddingHeight = paddingTop + paddingBottom;

  parent.style.height = (totalHeight + gapHeight + paddingHeight) + 'px';
}

function changeSafariButtonsSize() {
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
    // 在 Safari 浏览器中修改 button 和 select 的尺寸
    var buttons = document.getElementsByTagName('button');
    var selects = document.getElementsByTagName('select');
    var inputs = document.getElementsByTagName('input');
    var textAreas = document.getElementsByTagName('textarea');

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.fontSize = 'small';
    }

    for (var j = 0; j < selects.length; j++) {
      selects[j].style.fontSize = 'unset';
    }

    for (var k = 0; k < inputs.length; k++) {
      inputs[k].style.fontSize = 'small';
    }

    for (var x = 0; x < textAreas.length; x++) {
      textAreas[x].style.fontSize = 'unset';
    }
  }
}