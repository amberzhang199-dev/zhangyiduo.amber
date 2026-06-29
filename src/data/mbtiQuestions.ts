export interface QuizOption {
  key: string;
  label: string;
  dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'P' | 'J';
  value: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: [QuizOption, QuizOption];
}

export const mbtiQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '你的毛孩子看到门口有陌生人经过时，通常会？',
    options: [
      { key: 'a', label: '立刻冲过去打招呼，尾巴摇得像螺旋桨', dimension: 'E', value: 2 },
      { key: 'b', label: '远远观望，保持高冷距离', dimension: 'I', value: 2 },
    ],
  },
  {
    id: 2,
    question: '吃饭时间到了，你的毛孩子的反应是？',
    options: [
      { key: 'a', label: '疯狂暗示你、蹭你、甚至拉你到碗前面', dimension: 'E', value: 2 },
      { key: 'b', label: '安静坐在老地方等着，仿佛修炼禅定', dimension: 'I', value: 2 },
    ],
  },
  {
    id: 3,
    question: '你给它买了个新玩具，它会？',
    options: [
      { key: 'a', label: '先闻一闻、摸一摸、各种感官体验后才决定玩不玩', dimension: 'S', value: 2 },
      { key: 'b', label: '瞬间脑补出十种新玩法，创意无限', dimension: 'N', value: 2 },
    ],
  },
  {
    id: 4,
    question: '换了新的猫砂/狗粮品牌，它的适应速度如何？',
    options: [
      { key: 'a', label: '仔细确认是安全的之后，才小心翼翼接受', dimension: 'S', value: 2 },
      { key: 'b', label: '完全不在意细节，有得吃就行', dimension: 'N', value: 2 },
    ],
  },
  {
    id: 5,
    question: '你假装在它面前哭，它会？',
    options: [
      { key: 'a', label: '头也不抬，继续做自己的事情（酷）', dimension: 'T', value: 2 },
      { key: 'b', label: '蹭过来安慰你、用头顶你、舔你的手', dimension: 'F', value: 2 },
    ],
  },
  {
    id: 6,
    question: '面对宠物医院的大门，你的毛孩子的表现是？',
    options: [
      { key: 'a', label: '面无表情地走进去，仿佛在做理性分析', dimension: 'T', value: 2 },
      { key: 'b', label: '瑟瑟发抖或死命往外拽，情绪外放到极致', dimension: 'F', value: 2 },
    ],
  },
  {
    id: 7,
    question: '你的毛孩子每天的作息规律吗？',
    options: [
      { key: 'a', label: '精确到分钟！每天定点吃、定点睡、定点闹', dimension: 'J', value: 2 },
      { key: 'b', label: '完全随心情，你永远猜不到它下一秒要干嘛', dimension: 'P', value: 2 },
    ],
  },
  {
    id: 8,
    question: '家里突然多了一个新摆设，它会？',
    options: [
      { key: 'a', label: '研究一下就走了，秩序恢复正常', dimension: 'J', value: 2 },
      { key: 'b', label: '连续三天扑上去又跳下来，百玩不腻', dimension: 'P', value: 2 },
    ],
  },
  {
    id: 9,
    question: '你出门一整天回来，它会？',
    options: [
      { key: 'a', label: '在门口恭候你大驾光临，热情到快要窒息', dimension: 'E', value: 2 },
      { key: 'b', label: '慢悠悠踱步过来，给你一个"嗯你回来了"的眼神', dimension: 'I', value: 2 },
    ],
  },
  {
    id: 10,
    question: '你的毛孩子学新技能（如握手、翻滚）的方式是？',
    options: [
      { key: 'a', label: '重复练习，一步步按流程来', dimension: 'S', value: 2 },
      { key: 'b', label: '经常自创动作，举一反三到离谱', dimension: 'N', value: 2 },
    ],
  },
  {
    id: 11,
    question: '家里的其他小动物/玩偶被你抱了，它会？',
    options: [
      { key: 'a', label: '无所谓，该干嘛干嘛', dimension: 'T', value: 2 },
      { key: 'b', label: '醋意大发！立刻冲过来争宠', dimension: 'F', value: 2 },
    ],
  },
  {
    id: 12,
    question: '你临时改变了遛弯/喂食的时间，它会？',
    options: [
      { key: 'a', label: '明显不爽，用眼神/动作抗议你打乱了它的计划', dimension: 'J', value: 2 },
      { key: 'b', label: '随遇而安，换个时间也无所谓~', dimension: 'P', value: 2 },
    ],
  },
];
