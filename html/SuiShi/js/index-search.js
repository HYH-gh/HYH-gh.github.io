const data = 
[
  { id: 1, title: "龙抬头", tags: ["龙抬头","社日","剃龙头","引钱龙","春耕","苍龙七宿","土地神","草木灰画仓"] },
  { id: 2, title: "上巳节", tags: ["上巳","祓禊","曲水流觞","芍药定情","荠菜花簪","兰亭雅集","春浴","女儿节"] },
  { id: 3, title: "寒食节", tags: ["寒食","介子推","冷食","子推燕","青精饭","禁火","清明前","忠孝文化"] },
  { id: 4, title: "清明节", tags: ["清明","扫墓","踏青","青团","插柳","寒食遗风","放风筝","祭祖","农事起始"] },
  { id: 5, title: "端午节", tags: ["端午","龙舟","粽子","屈原","雄黄酒","五色丝","艾草","钟馗像","避五毒"] },
  { id: 6, title: "七夕节", tags: ["七夕","乞巧","牛郎织女","鹊桥","七孔针","磨喝乐","凤仙染甲","拜织女","爱情"]},
  { id: 7, title: "中元节", tags: ["中元","盂兰盆","河灯","施孤","目连戏","地官赦罪","焚纸衣","鬼节","祭幽"] },
  { id: 8, title: "中秋节", tags: ["中秋","月饼","赏月","玉兔","嫦娥","拜月","团圆宴","桂花酒","观潮","兔儿爷"] },
  { id: 9, title: "重阳节", tags: ["重阳","登高","菊花酒","敬老","茱萸","重阳糕","晒秋","辞青","长寿文化"] },
  { id: 10, title: "下元节", tags: ["下元","水官解厄","放水灯","海醮","豆泥骨朵","解厄法会","水神祭祀","三元节"] },
  { id: 11, title: "冬至节", tags: ["冬至","数九","祭天","饺子","汤圆","亚岁","日影测量","阳生","九九消寒图"] },
  { id: 12, title: "腊八节", tags: ["腊八","腊八粥","腊八蒜","佛成道日","冰祭","五谷祭祀","冻冰冰","腊祭遗风"] },
  { id: 13, title: "春节", tags: ["春节","除夕","年夜饭","春联","守岁","压岁钱","庙会","舞龙舞狮","春运","年画"] }
];

    const searchInput = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("results");

    // 防抖搜索逻辑
    let timeoutId;
    searchInput.addEventListener("input", function() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const keyword = this.value.trim().toLowerCase();
        if (!keyword) {
          resultsDiv.innerHTML = "";
          return;
        }

        const filteredData = data.filter(item => 
          item.title.toLowerCase().includes(keyword) ||
          item.tags.some(tag => tag.toLowerCase().includes(keyword))
        );

        displayResults(filteredData, keyword);
      }, 300);
    });

    // 渲染结果
    function displayResults(data, keyword) {
      if (data.length === 0) {
        resultsDiv.innerHTML = "<p>未找到相关结果</p>";
        return;
      }

      const html = data.map(item => `
        <div class="result-item" data-id="${item.id}">
          <h3>${highlightKeyword(item.title, keyword)}</h3>
          <!-- --><p>${item.tags.map(tag => highlightKeyword(tag, keyword)).join(", ")}</p> 
        </div>
      `).join("");

      resultsDiv.innerHTML = html;
    }

    // 高亮关键词
    function highlightKeyword(text, keyword) {
      if (!keyword) return text;
      return text.replace(new RegExp(`(${keyword})`, "gi"), "<mark>$1</mark>");
    }

    // 新增：点击结果跳转
    resultsDiv.addEventListener("click", (e) => {
      const resultItem = e.target.closest(".result-item");
      if (resultItem) {
        const id = resultItem.dataset.id;
        //window.location.href = `./html/0${id}.html`; 
		window.location.href = `./html/${String(id).padStart(2, '0')}.html`;// 跳转逻辑
      }
    });