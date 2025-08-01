// 反家暴庇护所数据
const shelterData = [
    // 上海
    {
        id: 'sh_001',
        name: '上海反家庭暴力庇护救助中心',
        address: '蒙自路430号（上海市救助管理站内）',
        city: '上海',
        province: '上海',
        position: [31.2304, 121.4737], // 上海市中心坐标
        type: 'shelter',
        description: '提供反家暴庇护救助服务',
        phone: '未提供',
        services: ['临时庇护', '法律援助', '心理支持']
    },
    
    // 广东
    {
        id: 'gd_001',
        name: '广州市反家暴庇护所',
        address: '具体地址未对外发布，市级两处，区县级6处',
        city: '广州',
        province: '广东',
        position: [23.1291, 113.2644],
        type: 'shelter',
        description: '广州市级两处庇护所，区县级6处',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助', '心理支持']
    },
    {
        id: 'gd_002',
        name: '中山市反家暴庇护所（石岐区安全屋）',
        address: '石岐区',
        city: '中山',
        province: '广东',
        position: [22.5170, 113.3927],
        type: 'shelter',
        description: '中山市石岐区安全屋',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助']
    },
    {
        id: 'gd_003',
        name: '东莞反家暴庇护所',
        address: '东莞企石白玉兰家庭服务中心',
        city: '东莞',
        province: '广东',
        position: [23.0204, 113.7518],
        type: 'shelter',
        description: '东莞企石白玉兰家庭服务中心',
        phone: '联系当地妇联',
        services: ['临时庇护', '家庭服务', '心理支持']
    },
    
    // 江苏
    {
        id: 'js_001',
        name: '无锡市反家暴庇护所',
        address: '广益新村130号',
        city: '无锡',
        province: '江苏',
        position: [31.4912, 120.3119],
        type: 'shelter',
        description: '无锡市反家暴庇护所',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助', '心理支持']
    },
    {
        id: 'js_002',
        name: '常州市反家暴庇护所',
        address: '常州市妇联在当地某连锁酒店设点',
        city: '常州',
        province: '江苏',
        position: [31.7728, 119.9463],
        type: 'shelter',
        description: '常州市妇联在当地某连锁酒店设点',
        phone: '联系当地妇联',
        services: ['临时庇护', '住宿服务']
    },
    {
        id: 'js_003',
        name: '徐州市反家暴庇护所',
        address: '徐州市贾汪区法院内',
        city: '徐州',
        province: '江苏',
        position: [34.2617, 117.2841],
        type: 'shelter',
        description: '徐州市贾汪区法院内',
        phone: '联系当地法院',
        services: ['临时庇护', '法律援助']
    },
    
    // 浙江
    {
        id: 'zj_001',
        name: '安吉市梅溪镇反家暴庇护所（木兰之家）',
        address: '梅溪镇妇联与派出所设立的"木兰之家"',
        city: '安吉',
        province: '浙江',
        position: [30.6380, 119.6808],
        type: 'shelter',
        description: '梅溪镇妇联与派出所设立的"木兰之家"',
        phone: '联系当地妇联或派出所',
        services: ['临时庇护', '法律援助', '警务支持']
    },
    {
        id: 'zj_002',
        name: '宁波市反家暴庇护所',
        address: '宁波市本级接收海曙、江东、江北、鄞州等地受助对象，余姚、慈溪、奉化、宁海、象山、镇海、北仑均单独设有庇护点',
        city: '宁波',
        province: '浙江',
        position: [29.8683, 121.5440],
        type: 'shelter',
        description: '宁波市及各区县均设有庇护点',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助', '心理支持']
    },
    
    // 福建
    {
        id: 'fj_001',
        name: '厦门反家暴庇护所',
        address: '具体地址未对外公布',
        city: '厦门',
        province: '福建',
        position: [24.4797, 118.0819],
        type: 'shelter',
        description: '厦门反家暴庇护所',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助', '心理支持']
    },
    
    // 四川
    {
        id: 'sc_001',
        name: '德阳旌阳区反家暴庇护所',
        address: '德阳市旌阳区人民法院内',
        city: '德阳',
        province: '四川',
        position: [31.1270, 104.3984],
        type: 'shelter',
        description: '德阳市旌阳区人民法院内',
        phone: '联系旌阳区法院',
        services: ['临时庇护', '法律援助']
    },
    {
        id: 'sc_002',
        name: '泸州市反家暴庇护所',
        address: '泸州市纳溪区法院内',
        city: '泸州',
        province: '四川',
        position: [28.8719, 105.4431],
        type: 'shelter',
        description: '泸州市纳溪区法院内',
        phone: '联系纳溪区法院',
        services: ['临时庇护', '法律援助']
    },
    
    // 安徽
    {
        id: 'ah_001',
        name: '合肥市反家暴庇护所',
        address: '合肥市瑶海区三里街街道三里三村社区',
        city: '合肥',
        province: '安徽',
        position: [31.8206, 117.2272],
        type: 'shelter',
        description: '合肥市瑶海区三里街街道三里三村社区',
        phone: '联系当地社区',
        services: ['临时庇护', '社区服务', '法律援助']
    },
    {
        id: 'ah_002',
        name: '亳州反家暴庇护所（木兰驿站）',
        address: '亳州木兰驿站',
        city: '亳州',
        province: '安徽',
        position: [33.8712, 115.7825],
        type: 'shelter',
        description: '亳州木兰驿站',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助', '心理支持']
    },
    
    // 山东
    {
        id: 'sd_001',
        name: '济南市反家暴庇护所',
        address: '济南市救助管理站内',
        city: '济南',
        province: '山东',
        position: [36.6512, 117.1201],
        type: 'shelter',
        description: '济南市救助管理站内',
        phone: '联系救助管理站',
        services: ['临时庇护', '救助服务', '法律援助']
    },
    {
        id: 'sd_002',
        name: '济南市章丘区反家暴庇护所',
        address: '济南市章丘区刁镇敬老院',
        city: '章丘',
        province: '山东',
        position: [36.7140, 117.5370],
        type: 'shelter',
        description: '济南市章丘区刁镇敬老院',
        phone: '联系当地敬老院',
        services: ['临时庇护', '养老服务']
    },
    
    // 河南
    {
        id: 'hn_001',
        name: '许昌市襄城县反家暴庇护中心',
        address: '襄城县人民法院内',
        city: '襄城县',
        province: '河南',
        position: [33.8530, 113.5054],
        type: 'shelter',
        description: '襄城县人民法院内',
        phone: '联系襄城县法院',
        services: ['临时庇护', '法律援助']
    },
    
    // 河北
    {
        id: 'hb_001',
        name: '石家庄市反家暴庇护所',
        address: '具体地址未对外公布',
        city: '石家庄',
        province: '河北',
        position: [38.0428, 114.5149],
        type: 'shelter',
        description: '石家庄市反家暴庇护所',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助', '心理支持']
    },
    
    // 湖南
    {
        id: 'hun_001',
        name: '长沙市反家暴庇护所',
        address: '具体地址未对外公布',
        city: '长沙',
        province: '湖南',
        position: [28.2282, 112.9388],
        type: 'shelter',
        description: '长沙市反家暴庇护所',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助', '心理支持']
    },
    
    // 湖北
    {
        id: 'hb2_001',
        name: '湖北监利县反家暴庇护所',
        address: '监利县救助管理站',
        city: '监利县',
        province: '湖北',
        position: [29.8326, 112.8999],
        type: 'shelter',
        description: '监利县救助管理站',
        phone: '联系救助管理站',
        services: ['临时庇护', '救助服务']
    },
    
    // 贵州
    {
        id: 'gz_001',
        name: '贵阳反家暴庇护所',
        address: '贵阳市救助管理站内',
        city: '贵阳',
        province: '贵州',
        position: [26.6470, 106.6302],
        type: 'shelter',
        description: '贵阳市救助管理站内',
        phone: '联系救助管理站',
        services: ['临时庇护', '救助服务', '法律援助']
    },
    
    // 云南
    {
        id: 'yn_001',
        name: '昆明市反家暴庇护所',
        address: '滇缅大道398号',
        city: '昆明',
        province: '云南',
        position: [24.8801, 102.8329],
        type: 'shelter',
        description: '昆明市反家暴庇护所',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助', '心理支持']
    },
    {
        id: 'yn_002',
        name: '玉溪市反家暴庇护所',
        address: '玉溪市红塔区未成年保护中心内',
        city: '玉溪',
        province: '云南',
        position: [24.3520, 102.5437],
        type: 'shelter',
        description: '玉溪市红塔区未成年保护中心内',
        phone: '联系未成年保护中心',
        services: ['临时庇护', '未成年保护', '法律援助']
    },
    {
        id: 'yn_003',
        name: '昆明市宜良县反家暴庇护所',
        address: '昆明市宜良县环城西路',
        city: '宜良县',
        province: '云南',
        position: [24.9194, 103.1416],
        type: 'shelter',
        description: '昆明市宜良县环城西路',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助']
    },
    
    // 黑龙江
    {
        id: 'hlj_001',
        name: '黑河北安市反家暴庇护所',
        address: '北安市建民路118号',
        city: '北安',
        province: '黑龙江',
        position: [48.2390, 126.4913],
        type: 'shelter',
        description: '北安市建民路118号',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助', '心理支持']
    },
    
    // 广西
    {
        id: 'gx_001',
        name: '南宁市反家暴庇护所',
        address: '南宁市良庆区人民法院内',
        city: '南宁',
        province: '广西',
        position: [22.8170, 108.3669],
        type: 'shelter',
        description: '南宁市良庆区人民法院内',
        phone: '联系良庆区法院',
        services: ['临时庇护', '法律援助']
    },
    {
        id: 'gx_002',
        name: '百色市反家暴庇护所',
        address: '具体地址未对外公布',
        city: '百色',
        province: '广西',
        position: [23.8977, 106.6157],
        type: 'shelter',
        description: '百色市反家暴庇护所',
        phone: '联系当地妇联',
        services: ['临时庇护', '法律援助', '心理支持']
    },
    
    // 甘肃
    {
        id: 'gs_001',
        name: '张掖市反家暴庇护所',
        address: '天水市妇女儿童心理援助中心内',
        city: '张掖',
        province: '甘肃',
        position: [38.9252, 100.4487],
        type: 'shelter',
        description: '天水市妇女儿童心理援助中心内',
        phone: '联系心理援助中心',
        services: ['临时庇护', '心理援助', '法律援助']
    },
    {
        id: 'gs_002',
        name: '天水市反家暴庇护所',
        address: '天水市妇女儿童心理援助中心',
        city: '天水',
        province: '甘肃',
        position: [34.5782, 105.7249],
        type: 'shelter',
        description: '天水市妇女儿童心理援助中心',
        phone: '联系心理援助中心',
        services: ['临时庇护', '心理援助', '法律援助']
    },
    
    // 女性友好公寓
    {
        id: 'nj_apartment_001',
        name: '「赛西亚」女性共居空间',
        address: '南京郊外（地址未完全公开，需通过特定女性社区或小程序私信申请）',
        city: '南京',
        province: '江苏',
        position: [32.0603, 118.7969], // 南京市坐标
        type: 'apartment',
        description: '全国较早公开报道的女性专属共居别墅，仅限女性入住，需通过特定渠道申请',
        phone: '需通过女性社区或小程序私信申请',
        services: ['女性专属', '共居空间', '安全住宿', '社区支持'],
        specialNote: '地址未完全公开，只能通过特定女性社区或小程序私信申请入住'
    },
    {
        id: 'sz_apartment_001',
        name: '「红山6979女生青年公寓」（深圳北站店）',
        address: '深圳北站附近',
        city: '深圳',
        province: '广东',
        position: [22.5431, 114.0579], // 深圳北站坐标
        type: 'apartment',
        description: '交通便利的女性青年公寓，面向女性群体，评分与评价较高',
        phone: '需联系公寓管理方',
        services: ['女性专属', '青年公寓', '交通便利', '安全住宿'],
        specialNote: '仅限女生入住，评分与评价较高'
    },
    {
        id: 'sh_apartment_001',
        name: '「东方巴黎女生青年旅舍」',
        address: '静安区，靠近地铁站',
        city: '上海',
        province: '上海',
        position: [31.2304, 121.4737], // 静安区坐标
        type: 'apartment',
        description: '为女性独行客或拼居需求安全设计，方便外卖送餐',
        phone: '需联系旅舍管理方',
        services: ['女性专属', '青年旅舍', '地铁便利', '外卖友好'],
        specialNote: '为女性独行客或拼居需求安全设计，方便外卖送餐'
    },
    {
        id: 'jl_apartment_001',
        name: '「万通药业科技公寓」',
        address: '吉林通化',
        city: '通化',
        province: '吉林',
        position: [41.7285, 125.9397], // 通化市坐标
        type: 'apartment',
        description: '为企业女性员工打造，对女性安全和支持度高',
        phone: '需联系企业人事部门',
        services: ['企业公寓', '女性友好', '员工福利', '安全住宿'],
        specialNote: '虽然主打员工福利，但对女性安全和支持度高，与"女性友好"特性相符'
    }
];

// 导出数据供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = shelterData;
} 