#! /usr/bin/env node

// arguments validation
if (process.argv.length < 3) {
  console.error('please specify codepen URL');
  process.exit(1);
}
const codepenUrl = process.argv[2];
if (!codepenUrl.startsWith('https://codepen.io/')) {
  console.error(`codepen URL '${codepenUrl}' is not valid`);
  process.exit(1);
}

const targetPath = process.argv[3] || '.';

const HtmlEntities = require('html-entities').AllHtmlEntities;
const html = new HtmlEntities();


const rp = require('request-promise');
const $ = require('cheerio');
(async ()=>{
  const responseHtml = await rp(codepenUrl);
  const pen = 
    JSON.parse(
      html.decode(
        $('input#init-data', responseHtml).get(0).attribs.value
      )
    );
  const item = JSON.parse(pen.__item);

  type ItemResource = {
    url: string
  }
  const dataNeeded = {
    resources: item.resources,
    html: item.html,
    js: item.js,
    css: item.css,
    preProcessors: {
      html: item.html_pre_processor,
      css: item.css_pre_processor,
      js: item.js_pre_processor
    }
  };
  //console.log(/*pen, */item);// item .resources, html, css, js; html_pre_processor(pug/none), css_pre_processor, js_pre_processor
  console.log(dataNeeded);
  // TODO: if pre-processor is not supported - download processed document
  const supportedPreProcessors = {
    js: ['none'],
    css: ['none'],
    html: ['none']
  }

  type FileType = 'js' | 'css' | 'html';
  var fs = require('fs');
  var dir = targetPath;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const fileTypes: FileType[] = ['js', 'css', 'html'];
  // todo: file name may depend of preprocessor
  const fileNames: { [f in FileType]: string }= {
    js: 'index.js',
    css: 'style.css',
    html: 'index.html'
  };
  fileTypes.forEach(async (fileType: FileType) => {
    const preProcessor = dataNeeded.preProcessors[fileType];
    let fileContent = supportedPreProcessors[fileType].includes(preProcessor)
      ? dataNeeded[fileType]
      : await rp(codepenUrl + '.' + fileType);
    if (fileType === 'html') {

      let headerResources = dataNeeded.resources
        .filter( (resource: ItemResource) => (<string>resource.url).endsWith('.css'))
        .map((resource: ItemResource) => resource.url);
      headerResources.push('style.css');
      let prefix = headerResources
        .map( (url: string) => `<link rel="stylesheet" href="${url}" />`)
        .join('\n');

      let footerResources = dataNeeded.resources
        .filter( (resource: ItemResource) => (<string>resource.url).endsWith('.js'))
        .map((resource: ItemResource) => resource.url);
      footerResources.push('index.js');
      let suffix = footerResources
        .map( (url: string) => `<script src="${url}"></script>`)
        .join('\n');
      fileContent = `<head>\n${prefix}</head>\n<body>\n${fileContent}\n\n${suffix}\n</body>`;
    }
    const fileName = fileNames[fileType];
    // todo:  use path.normalize
    const filePath = dir + '/' + fileName;
    fs.writeFileSync(filePath, fileContent);
  })
  /*
resources: 
   [ { url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
       order: 0,
       resource_type: 'js',
       action: 'include_js_url',
       content: '',
       original_content: '',
       text_to_replace: null } ]
  */

  //todo : catch
})();