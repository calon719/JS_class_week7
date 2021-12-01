const form = document.querySelector('.addTicket-form');
const addTicketInputs = document.querySelectorAll('[data-prop="ticketInput"]');
const addTicketBtn = document.querySelector('#addTicketBtn');
const cardList = document.querySelector('.ticketList');
const searchAreaInput = document.querySelector('.searchRegion');
const searchResultNum = document.querySelector('.searchResultNum');

// 資料
let ticketData;

// 事件
addTicketBtn.addEventListener('click', checkInput);
searchAreaInput.addEventListener('change', areaFilter);
addTicketInputs.forEach(function (item) {
  item.addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      checkInput();
    }
  });
});


axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json').then(function (response) {
  ticketData = response.data.data;
  renderData(ticketData);
  updateChart(ticketData);
}).catch(function (error) {
  console.log(error);
});

function checkInput(e) {
  if (e != undefined && e.type == 'click') {
    e.preventDefault();
  };

  addTicketInputs.forEach(function (item) {
    item.nextElementSibling.setAttribute('class', 'invisible text-danger text-tiny mb-0.5');
  });

  let constraints = {
    name: {
      presence: {
        message: '^必填'
      }
    },
    imgUrl: {
      presence: {
        message: '^必填'
      },
      url: {
        schemes: ['http', 'https'],
        message: '^不是正確的網址'
      }
    },
    area: {
      presence: {
        message: '^必填'
      }
    },
    price: {
      presence: {
        message: '^必填'
      },
      numericality: {
        greaterThan: 0,
        message: '^金額必須大於 0'
      }
    },
    group: {
      presence: {
        message: '^必填'
      },
      numericality: {
        greaterThan: 0,
        message: '^數量必須大於 0'
      }
    },
    rate: {
      presence: {
        message: '^必填'
      },
      numericality: {
        greaterThan: 0,
        lessThanOrEqualTo: 10,
        message: '^星級為 1 - 10 分'
      }
    },
    description: {
      presence: {
        message: '^必填'
      },
      length: {
        maximum: 100,
        message: '^字數不可以超過 100 字'
      }
    }
  };

  let errors = validate(form, constraints);

  if (errors) {
    Object.keys(errors).forEach(function (key) {
      let el = document.querySelector(`[data-ticketInput="${key}"]`);
      let classToggle = el.getAttribute('data-class-toggle');

      el.classList.toggle(classToggle);
      el.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${errors[key]}`;
    });
  } else {
    addTicket();
  };
};

// 新增資料到 物件 ticketData
function addTicket() {
  let obj = {};

  addTicketInputs.forEach(function (item) {
    obj.id = ticketData.length;
    if (item.getAttribute('type') === 'number') {
      obj[item.getAttribute('name')] = parseInt(item.value);
    } else {
      obj[item.getAttribute('name')] = item.value;
    };
    item.value = '';
  });
  ticketData.push(obj);
  searchAreaInput.value = '全部';
  areaFilter(); // 更新畫面
  updateChart(ticketData); // 更新圖表
};

// 篩選資料
// 篩選後會顯示『搜尋資料為 ? 筆』
function areaFilter() {
  let inputValue = searchAreaInput.value;
  let searchResultData;

  if (inputValue === '' || inputValue === '全部') {
    searchResultData = ticketData;
  } else {
    searchResultData = ticketData.filter(function (item) {
      return item.area === inputValue;
    });
  };
  renderData(searchResultData);
};

// 組裝字串、渲染畫面
function renderData(data) {
  let str = '';
  let resultNum = 0;
  data.forEach(function (item) {
    resultNum++;
    str += `
      <li class="flex flex-col bg-white transform hover:scale-105 transition-all duration-700 ease-out rounded relative shadow">
        <div class="bg-secondary text-white text-xl rounded-r py-2 px-5 absolute -top-5 left-0">${item.area}</div>
        <div class="h-45 bg-no-repeat bg-cover bg-center rounded-t"style="background-image: url('${item.imgUrl}');"></div>
        <div class="relative text-primary pt-5 pb-4 px-5 flex flex-grow flex-col justify-between">
          <div class="absolute bg-primary text-white w-10 text-center rounded-r py-1 -top-4 left-0">${item.rate}</div>
          <div>
            <h2 class="font-bold text-2xl pb-1 mb-4 border-b-2">${item.name}</h2>
            <p class="text-gray-500 mb-8 break-words">${item.description}</p>
          </div>
          <div class="flex justify-between items-center">
            <p><i class="fas fa-exclamation-circle"></i><span class="font-medium">剩下最後 ${item.group} 組</span></p>
            <p class="font-medium flex items-center">TWD<span class="text-4xl ml-1">$${item.price}</span></p>
          </div>
        </div>
      </li>
    `;
  });
  cardList.innerHTML = str;
  searchResultNum.textContent = resultNum;
};


// 更新 donut chart
function updateChart(data) {
  let areaChartData = [];
  let areaData = [];

  data.forEach(function (item) {
    let obj = {};
    let aryCheck = areaData.some(function (itemCheck) { return itemCheck.area === item.area });
    if (areaData.length === 0 || !aryCheck) {
      obj.area = item.area;
      obj.num = 1;
      areaData.push(obj);
    } else {
      areaData.forEach(function (aryItem) {
        if (aryItem.area === item.area) {
          aryItem.num += 1;
        };
      });
    };
  });

  areaData.forEach(function (item) {
    let ary = [];
    ary.push(item.area, item.num)
    areaChartData.push(ary);
  });

  let chart = c3.generate({
    bindto: '.areaChart',
    data: {
      columns: areaChartData,
      type: 'donut'
    },
    donut: {
      title: '套票地區比重',
      width: 10,
      label: {
        show: false
      }
    },
    size: {
      height: 180,
      width: 160
    },
  });
}

