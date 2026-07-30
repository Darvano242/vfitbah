const fs=require('fs');
const path=require('path');

const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

const replacements=[
  {
    name:'public gallery text walker',
    from:`while(walker.nextNode()) nodes.push(walker.currentNode);`,
    to:`while(walker.nextNode()){var current=walker.currentNode;var parent=current&&current.parentElement;if(parent&&parent.closest('script,style,noscript,template'))continue;nodes.push(current);}`
  },
  {
    name:'human copy text walker',
    from:`while((node = walker.nextNode())){
        var old = node.nodeValue;`,
    to:`while((node = walker.nextNode())){
        var parent=node&&node.parentElement;
        if(parent&&parent.closest('script,style,noscript,template')) continue;
        var old = node.nodeValue;`
  },
  {
    name:'program experience text walker',
    from:`const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);`,
    to:`const nodes=[]; while(walker.nextNode()){const current=walker.currentNode;const parent=current&&current.parentElement;if(parent&&parent.closest('script,style,noscript,template'))continue;nodes.push(current);}`
  }
];

for(const replacement of replacements){
  if(html.includes(replacement.from))html=html.replace(replacement.from,replacement.to);
  if(!html.includes(replacement.to))throw new Error('Could not harden '+replacement.name);
}

// Guard attribute rewriting too; script/style nodes should never enter these UI-only passes.
html=html.replace(
  `document.querySelectorAll('[title],[aria-label]').forEach(function(el){`,
  `document.querySelectorAll('[title],[aria-label]').forEach(function(el){\n        if(el.closest&&el.closest('script,style,noscript,template')) return;`
);

fs.writeFileSync(file,html);
console.log('Hardened legacy copy observers to visible UI text only');
