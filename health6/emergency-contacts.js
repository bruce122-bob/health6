const emergencyContacts = {
    china: [
        { type: "警察", number: "110" },
        { type: "急救", number: "120" },
        { type: "消防", number: "119" },
        { type: "交通事故", number: "122" }
    ],
    usa: [
        { type: "通用紧急", number: "911" },
        { type: "毒物控制", number: "1-800-222-1222" }
    ],
    uk: [
        { type: "通用紧急", number: "999" },
        { type: "非紧急警察", number: "101" },
        { type: "非紧急医疗", number: "111" }
    ],
    japan: [
        { type: "警察", number: "110" },
        { type: "急救/消防", number: "119" }
    ],
    korea: [
        { type: "通用紧急", number: "112" },
        { type: "消防/救护", number: "119" }
    ]
};

class EmergencyContactManager {
    constructor() {
        this.regionSelect = document.getElementById('regionSelect');
        this.contactList = document.getElementById('contactList');
        this.template = this.contactList.querySelector('.template');
        
        this.init();
    }

    init() {
        this.regionSelect.addEventListener('change', () => {
            this.updateContacts(this.regionSelect.value);
        });
    }

    updateContacts(region) {
        // 清除现有联系方式（除了模板）
        while (this.contactList.children.length > 1) {
            this.contactList.removeChild(this.contactList.lastChild);
        }

        if (!region || !emergencyContacts[region]) return;

        // 添加新的联系方式
        emergencyContacts[region].forEach(contact => {
            const card = this.template.cloneNode(true);
            card.classList.remove('template');
            
            card.querySelector('.service-type').textContent = contact.type;
            card.querySelector('.phone-number').textContent = contact.number;
            
            this.contactList.appendChild(card);
        });
    }
}

// 初始化紧急联系管理器
document.addEventListener('DOMContentLoaded', () => {
    new EmergencyContactManager();
}); 