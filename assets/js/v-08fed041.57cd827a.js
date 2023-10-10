"use strict";(self.webpackChunk_ovh_ux_manager_documentation=self.webpackChunk_ovh_ux_manager_documentation||[]).push([[170],{6513:(n,s,e)=>{e.r(s),e.d(s,{data:()=>a});const a=JSON.parse('{"key":"v-08fed041","path":"/guide/releasing.html","title":"Releasing","lang":"en-US","frontmatter":{},"excerpt":"","headers":[{"level":2,"title":"Prepare","slug":"prepare","link":"#prepare","children":[]}],"git":{"updatedTime":1696929874000,"contributors":[{"name":"ovh-cds","email":"134954692+JacquesLarique@users.noreply.github.com","commits":1}]},"filePathRelative":"guide/releasing.md"}')},5241:(n,s,e)=>{e.r(s),e.d(s,{default:()=>r});var a=e(8917);const i=(0,a.uE)('<h1 id="releasing" tabindex="-1"><a class="header-anchor" href="#releasing" aria-hidden="true">#</a> Releasing</h1><div class="custom-container warning"><p class="custom-container-title">TODOs</p><p>⚠️ This section is in a work in progress ⚠️</p></div><p>Releasing a new version of Manager 🎉</p><h2 id="prepare" tabindex="-1"><a class="header-anchor" href="#prepare" aria-hidden="true">#</a> Prepare</h2>',4),l={href:"https://github.com/ovh/manager/pulls",target:"_blank",rel:"noopener noreferrer"},t=(0,a._)("li",null,[(0,a._)("p",null,[(0,a.Uk)("Create a new PR for the "),(0,a._)("code",null,"develop"),(0,a.Uk)(" branch. Please use the following template for the PR description, linking to the relevant issues and/or pull requests for each change, removing irrelevant headings:")])],-1),p=(0,a.uE)('<div class="language-markdown line-numbers-mode" data-ext="md"><pre class="language-markdown"><code><span class="token title important"><span class="token punctuation">#</span> 📦 New release</span>\n\nApproximate release date: 📆 DD/MM/YY\n\n<span class="token title important"><span class="token punctuation">##</span> Dashboard</span>\n\n<span class="token title important"><span class="token punctuation">###</span> :sparkles: Features</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n<span class="token title important"><span class="token punctuation">###</span> :bug: Bug Fixes</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n<span class="token title important"><span class="token punctuation">##</span> Web Cloud</span>\n\n<span class="token title important"><span class="token punctuation">###</span> :sparkles: Features</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n<span class="token title important"><span class="token punctuation">###</span> :bug: Bug Fixes</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n<span class="token title important"><span class="token punctuation">##</span> Bare Metal Cloud</span>\n\n<span class="token title important"><span class="token punctuation">###</span> :sparkles: Features</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n<span class="token title important"><span class="token punctuation">###</span> :bug: Bug Fixes</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n<span class="token title important"><span class="token punctuation">##</span> Hosted Private Cloud</span>\n\n<span class="token title important"><span class="token punctuation">###</span> :sparkles: Features</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n<span class="token title important"><span class="token punctuation">###</span> :bug: Bug Fixes</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n<span class="token title important"><span class="token punctuation">##</span> Public Cloud</span>\n\n<span class="token title important"><span class="token punctuation">###</span> :sparkles: Features</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n<span class="token title important"><span class="token punctuation">###</span> :bug: Bug Fixes</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n<span class="token title important"><span class="token punctuation">##</span> Telecom</span>\n\n<span class="token title important"><span class="token punctuation">###</span> :sparkles: Features</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n<span class="token title important"><span class="token punctuation">###</span> :bug: Bug Fixes</span>\n\n<span class="token list punctuation">-</span> [ ] Description #\n\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>',1),c={},r=(0,e(6049).Z)(c,[["render",function(n,s){const e=(0,a.up)("ExternalLinkIcon");return(0,a.wg)(),(0,a.iD)("div",null,[i,(0,a._)("ol",null,[(0,a._)("li",null,[(0,a._)("p",null,[(0,a.Uk)("Decide which "),(0,a._)("a",l,[(0,a.Uk)("PRs"),(0,a.Wm)(e)]),(0,a.Uk)(" should be part of the next release.")])]),t]),p])}]])}}]);