import{_ as a,o as s,c as e,Q as n}from"./chunks/framework.2eec50d8.js";const o="/manager/assets/img/enabling-developer-mode.jpg",t="/manager/assets/img/developer-mode-enabled.jpg",E=JSON.parse('{"title":"Getting started","description":"","frontmatter":{},"headers":[],"relativePath":"guide/getting-started.md","filePath":"guide/getting-started.md","lastUpdated":1709802941000}'),l={name:"guide/getting-started.md"},r=n(`<h1 id="getting-started" tabindex="-1">Getting started <a class="header-anchor" href="#getting-started" aria-label="Permalink to &quot;Getting started&quot;">​</a></h1><h2 id="prerequisites" tabindex="-1">Prerequisites <a class="header-anchor" href="#prerequisites" aria-label="Permalink to &quot;Prerequisites&quot;">​</a></h2><ul><li><a href="https://git-scm.com" target="_blank" rel="noreferrer">Git</a></li><li><a href="https://nodejs.org/en/" target="_blank" rel="noreferrer">Node.js</a> ^18</li><li><a href="https://yarnpkg.com/lang/en/" target="_blank" rel="noreferrer">Yarn</a> &gt;= 1.21.1</li><li>Supported OS: GNU/Linux, macOS and Windows</li></ul><p>To install these prerequisites, you can follow the <a href="/manager/how-to/">How To section</a> of the documentation.</p><h2 id="install" tabindex="-1">Install <a class="header-anchor" href="#install" aria-label="Permalink to &quot;Install&quot;">​</a></h2><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># Clone the repository</span></span>
<span class="line"><span style="color:#B392F0;">$</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">git</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">clone</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">https://github.com/ovh/manager.git</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Go to the project root</span></span>
<span class="line"><span style="color:#B392F0;">$</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">cd</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">manager</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># If you are using nvm</span></span>
<span class="line"><span style="color:#B392F0;">$</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">nvm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">use</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Install</span></span>
<span class="line"><span style="color:#B392F0;">$</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">yarn</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">install</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># Clone the repository</span></span>
<span class="line"><span style="color:#6F42C1;">$</span><span style="color:#24292E;"> </span><span style="color:#032F62;">git</span><span style="color:#24292E;"> </span><span style="color:#032F62;">clone</span><span style="color:#24292E;"> </span><span style="color:#032F62;">https://github.com/ovh/manager.git</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Go to the project root</span></span>
<span class="line"><span style="color:#6F42C1;">$</span><span style="color:#24292E;"> </span><span style="color:#032F62;">cd</span><span style="color:#24292E;"> </span><span style="color:#032F62;">manager</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># If you are using nvm</span></span>
<span class="line"><span style="color:#6F42C1;">$</span><span style="color:#24292E;"> </span><span style="color:#032F62;">nvm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">use</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Install</span></span>
<span class="line"><span style="color:#6F42C1;">$</span><span style="color:#24292E;"> </span><span style="color:#032F62;">yarn</span><span style="color:#24292E;"> </span><span style="color:#032F62;">install</span></span></code></pre></div><h2 id="allow-your-account-to-be-used-to-develop-on-our-open-source-customer-interfaces" tabindex="-1">Allow your account to be used to develop on our open-source customer interfaces <a class="header-anchor" href="#allow-your-account-to-be-used-to-develop-on-our-open-source-customer-interfaces" aria-label="Permalink to &quot;Allow your account to be used to develop on our open-source customer interfaces&quot;">​</a></h2><p>In order for you to allow your account to connect to the applications we will describe in the <a href="/manager/guide/applications.html">Applications</a>, you will need to enable the &quot;developer mode&quot; on it.</p><p>To do so connect to the customer interface of the region in which your account has been created and go to the &quot;Advanced settings&quot; tab of your account configuration page.</p><ul><li><a href="https://ovh.com/manager/dedicated/#/useraccount/advanced" target="_blank" rel="noreferrer">EU</a></li><li><a href="https://ca.ovh.com/manager/dedicated/#/useraccount/advanced" target="_blank" rel="noreferrer">CA</a></li><li><a href="https://us.ovhcloud.com/manager/dedicated/#/useraccount/advanced" target="_blank" rel="noreferrer">US</a></li></ul><p>Once in there please check the box &quot;I want to enable developer mode on this account&quot;</p><p><img src="`+o+'" alt=""></p><p>Once clicked, the checkbox will look like this.</p><p><img src="'+t+'" alt=""></p><p>You can now follow the <a href="/manager/guide/applications.html">Applications</a> section of this documentation to try and boot your dev manager. You will be able to connect with your customer account to this dev version of the manager.</p>',15),p=[r];function c(i,d,u,h,y,g){return s(),e("div",null,p)}const f=a(l,[["render",c]]);export{E as __pageData,f as default};
