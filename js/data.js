/* 动作库 / 课程 / 12周计划模板 —— 内联数据，不使用 fetch */
'use strict';

const EXERCISES = [
  {
    id: 'breath-360', name: '360°呼吸 + 轻腹压', en: '360 Breathing', location: 'home',
    muscles: '膈肌、腹横肌', equipment: '无',
    steps: ['仰卧屈膝', '吸气时腹部、侧腰、后腰均匀扩张', '呼气时像系紧低一格腰带，收紧约20%-30%', '全程不憋气，保持能正常呼吸'],
    mistakes: ['全程憋气', '把腰用力压平'], stop: null,
    dosing: { sets: '3', reps: '5次呼吸', note: '5次呼吸×3组' }, type: 'reps'
  },
  {
    id: 'pelvic-tilt', name: '骨盆倾斜', en: 'Pelvic Tilt', location: 'home',
    muscles: '腹肌、下背', equipment: '无', anim: 'assets/anim/gifs/pelvic-tilt.gif',
    steps: ['仰卧屈膝', '在舒适范围内轻轻前后滚动骨盆', '动作小而慢，找到中间最省力的位置', '不要用脚推地或屏气'],
    mistakes: [], stop: null,
    dosing: { sets: '1-2', reps: '8-12次' }, type: 'reps'
  },
  {
    id: 'glute-bridge', name: '低位臀桥', en: 'Glute Bridge', location: 'home',
    muscles: '臀肌、腘绳肌、核心', equipment: '无', anim: 'assets/anim/gifs/glute-bridge.gif',
    steps: ['仰卧屈膝，脚跟距臀约一脚', '呼气收腹后抬髋', '抬到肩—髋—膝接近直线即可', '夹臀1秒，缓慢下落'],
    mistakes: ['抬得过高', '由腰椎代偿后仰'], stop: null,
    dosing: { sets: '2-3', reps: '8-12次' }, type: 'reps'
  },
  {
    id: 'dead-bug', name: '改良死虫', en: 'Dead Bug', location: 'home',
    muscles: '核心、髋屈肌', equipment: '无', anim: 'assets/anim/gifs/dead-bug.gif',
    steps: ['仰卧，屈髋屈膝', '先只做单侧脚跟点地', '肋骨不过度外翻，腰部保持自然稳定', '若腰拱起，缩短腿的移动距离'],
    mistakes: ['腰部拱起离地'], stop: null,
    dosing: { sets: '2-3', reps: '6-10次/侧' }, type: 'reps'
  },
  {
    id: 'bird-dog', name: '鸟狗（短杠杆起步）', en: 'Bird Dog', location: 'home',
    muscles: '核心、臀肌', equipment: '无', anim: ['assets/anim/svg/bird-dog/frame-1.svg','assets/anim/svg/bird-dog/frame-2.svg','assets/anim/svg/bird-dog/frame-3.svg'],
    steps: ['四点跪姿，先只抬一手或一脚', '稳定后再做对侧手脚同时伸出', '想象腰背放着一杯水，骨盆不旋转', '向远处延伸，不要抬得过高'],
    mistakes: ['骨盆旋转', '抬得过高手脚'], stop: null,
    dosing: { sets: '2-3', reps: '6-10次/侧' }, type: 'reps'
  },
  {
    id: 'side-plank', name: '高位/屈膝侧桥', en: 'Side Plank', location: 'home',
    muscles: '腹斜肌、肩、臀', equipment: '桌子/垫子', anim: 'assets/anim/gifs/side-plank.gif',
    steps: ['初级：前臂支撑桌面', '进阶：屈膝地面侧桥', '头、胸廓、骨盆保持一线', '避免塌腰，正常呼吸'],
    mistakes: ['塌腰', '耸肩'], stop: null,
    dosing: { sets: '2-3', reps: '10-30秒/侧', type: 'hold' }, type: 'hold'
  },
  {
    id: 'sit-stand', name: '坐到站', en: 'Sit to Stand', location: 'home',
    muscles: '股四头、臀肌、核心', equipment: '稳固椅子', anim: 'assets/anim/gifs/sit-stand.gif',
    steps: ['椅子固定，脚掌踩稳', '髋向后坐', '胸廓与骨盆一起移动', '不在底部突然蜷腰', '需要时双手扶腿'],
    mistakes: ['底部突然蜷腰'], stop: null,
    dosing: { sets: '2-3', reps: '8-12次' }, type: 'reps'
  },
  {
    id: 'step-up', name: '低台阶上步', en: 'Step Up', location: 'home',
    muscles: '股四头、臀肌', equipment: '10-15cm稳固台阶', anim: 'assets/anim/gifs/step-up.gif',
    steps: ['从10-15cm稳固台阶开始，手扶栏杆', '由上方腿发力', '膝盖朝第二脚趾方向', '控制下台，避免身体快速下坠'],
    mistakes: ['下台时身体下坠'], stop: null,
    dosing: { sets: '2-3', reps: '6-10次/侧' }, type: 'reps'
  },
  {
    id: 'hip-flexor-stretch', name: '跪姿髋屈肌拉伸', en: 'Kneeling Hip Flexor Stretch', location: 'home',
    muscles: '髋屈肌', equipment: '无', anim: ['assets/anim/svg/hip-flexor-stretch/frame-1.svg','assets/anim/svg/hip-flexor-stretch/frame-2.svg','assets/anim/svg/hip-flexor-stretch/frame-3.svg'],
    steps: ['半跪姿', '先轻收臀并做骨盆后倾', '身体整体微前移', '感受前侧髋部拉伸', '腰部不要后仰'],
    mistakes: ['腰部后仰代偿'], stop: null,
    dosing: { sets: '2', reps: '20-30秒/侧', type: 'hold' }, type: 'hold'
  },
  {
    id: 'hamstring-stretch', name: '腘绳肌温和拉伸', en: 'Hamstring Stretch', location: 'home',
    muscles: '腘绳肌', equipment: '无', anim: 'assets/anim/gifs/hamstring-stretch.gif',
    steps: ['只在感受到大腿后侧肌肉牵拉感时保持', '保持脊柱舒适，膝可微屈'],
    mistakes: ['强行压腿'], stop: '出现电击、麻木或小腿放射感立即停止',
    dosing: { sets: '2', reps: '15-20秒/侧', type: 'hold' }, type: 'hold'
  },
  {
    id: 'pallof-press', name: 'Pallof 推', en: 'Pallof Press', location: 'gym',
    muscles: '核心、腹斜肌', equipment: '绳索/弹力带', alt: ['dead-bug'], anim: 'assets/anim/gifs/pallof-press.gif',
    steps: ['绳索与胸口同高，侧对器械站立', '肋骨叠在骨盆上', '双手前推时身体不被拉转', '从轻重量、窄站距开始'],
    mistakes: ['被绳索拉转身体'], stop: null,
    dosing: { sets: '2-3', reps: '8-12次/侧' }, type: 'reps'
  },
  {
    id: 'chest-row', name: '胸托划船', en: 'Chest Supported Row', location: 'gym',
    muscles: '背部、肱二头', equipment: '胸托划船器械', alt: ['lat-pulldown'], tip: '无胸托划船器械时，可用坐姿绳索划船替代', anim: ['assets/anim/svg/chest-row/frame-1.svg','assets/anim/svg/chest-row/frame-2.svg','assets/anim/svg/chest-row/frame-3.svg'],
    steps: ['胸部贴稳支撑垫，脚掌踩实', '先下沉肩胛', '再把肘拉向后下方', '不为增加幅度而挺腰'],
    mistakes: ['挺腰代偿'], stop: null,
    dosing: { sets: '2-3', reps: '8-12次' }, type: 'reps'
  },
  {
    id: 'lat-pulldown', name: '中立握下拉', en: 'Lat Pulldown', location: 'gym',
    muscles: '背阔肌', equipment: '高位下拉器械', alt: ['chest-row'], anim: 'assets/anim/gifs/lat-pulldown.gif',
    steps: ['躯干略后倾但保持稳定', '把手拉向上胸', '肩膀远离耳朵', '不反复甩动借力'],
    mistakes: ['甩动借力'], stop: '坐位诱发腿症状改为胸托划船',
    dosing: { sets: '2-3', reps: '8-12次' }, type: 'reps'
  },
  {
    id: 'goblet-squat', name: '箱式高脚杯深蹲', en: 'Goblet Box Squat', location: 'gym',
    muscles: '股四头、臀、核心', equipment: '哑铃+高箱', alt: ['sit-stand'], anim: 'assets/anim/gifs/goblet-squat.gif',
    steps: ['哑铃贴近胸口', '向后坐到高箱/长凳', '膝脚同向', '躯干与骨盆整体移动', '从高箱开始，稳定后再降低'],
    mistakes: ['膝内扣', '弯腰'], stop: null,
    dosing: { sets: '2-3', reps: '6-10次' }, type: 'reps'
  },
  {
    id: 'split-squat', name: '扶架分腿蹲', en: 'Split Squat', location: 'gym',
    muscles: '股四头、臀、核心', equipment: '哑铃+固定架', alt: ['sit-stand'], tip: '平衡较差的新手可用坐到站代替', anim: 'assets/anim/gifs/split-squat.gif',
    steps: ['一手扶架保持平衡', '前脚全掌着地', '垂直下降，后膝朝地面', '避免前后摇晃', '先徒手再持轻哑铃'],
    mistakes: ['身体前后摇晃'], stop: null,
    dosing: { sets: '2-3', reps: '6-10次/侧' }, type: 'reps'
  },
  {
    id: 'hip-thrust', name: '髋推', en: 'Hip Thrust', location: 'gym',
    muscles: '臀肌、腘绳肌', equipment: '杠铃/哑铃+凳', alt: ['glute-bridge'], tip: '新手第1-2周可用臀桥代替，先掌握臀部发力再做髋推', anim: ['assets/anim/svg/hip-thrust/frame-1.svg','assets/anim/svg/hip-thrust/frame-2.svg','assets/anim/svg/hip-thrust/frame-3.svg'],
    steps: ['下巴微收，肋骨不外翻', '由臀部完成伸髋', '顶端不过度后仰', '重量放髋部并用软垫'],
    mistakes: ['顶端过度后仰'], stop: null,
    dosing: { sets: '2-3', reps: '8-12次' }, type: 'reps'
  },
  {
    id: 'farmer-carry', name: '农夫行走', en: 'Farmer Carry', location: 'gym',
    muscles: '前臂、上背、核心', equipment: '哑铃/壶铃', anim: 'assets/anim/gifs/farmer-carry.gif',
    steps: ['从双手等重开始', '身体直立、步幅自然', '不耸肩、不屏气', '转身时放慢'],
    mistakes: ['耸肩', '屏气'], stop: null,
    dosing: { sets: '3-5', reps: '20-40米', type: 'walk' }, type: 'walk'
  },
  {
    id: 'gym-step-up', name: '台阶上步（健身房）', en: 'Weighted Step Up', location: 'gym',
    muscles: '股四头、臀肌', equipment: '台阶+哑铃', anim: 'assets/anim/gifs/gym-step-up.gif',
    steps: ['选能保持骨盆水平的台阶高度', '身体略前倾但腰背稳定', '控制下降'],
    mistakes: [], stop: null,
    dosing: { sets: '2', reps: '6-10次/侧' }, type: 'reps'
  },
  {
    id: 'db-rdl', name: '哑铃罗马尼亚硬拉（进阶）', en: 'Dumbbell RDL', location: 'gym',
    muscles: '臀、腘绳肌、下背', equipment: '哑铃', alt: ['hip-thrust', 'glute-bridge'], anim: 'assets/anim/gifs/db-rdl.gif',
    steps: ['哑铃沿大腿下降，臀部向后', '只到还能保持控制的深度', '感受腘绳肌张力后夹臀站起', '不在底部反弹'],
    mistakes: ['底部反弹', '腰部弯曲'], stop: '出现腿部远端化（症状向小腿/足扩散）立即停止',
    dosing: { sets: '2-3', reps: '6-10次', advanced: true }, type: 'reps'
  },
  {
    id: 'back-ext', name: '臀主导45°背伸（进阶可选）', en: 'Back Extension', location: 'gym',
    muscles: '臀、腘绳肌、下背', equipment: '罗马背伸椅', alt: ['glute-bridge', 'hip-thrust'], anim: 'assets/anim/gifs/back-ext.gif',
    steps: ['髋垫低于髋折点', '动作发力来自髋部', '只起到身体成直线', '优先徒手'],
    mistakes: ['顶端过度后仰', '旋转'], stop: '对后伸敏感者、急性腿痛者不做',
    dosing: { sets: '2', reps: '8-12次', advanced: true }, type: 'reps'
  }
];

const EXERCISE_MAP = {};
EXERCISES.forEach(function (e) { EXERCISE_MAP[e.id] = e; });

/* 课程定义：items 为 {exercise, dose, note?} 或 {kind:'note', text} */
const SESSIONS = {
  H0: {
    id: 'H0', name: 'H0 恢复课', sub: '10-15分钟 · 居家', location: 'home',
    items: [
      { kind: 'note', text: '步行 5-10 分钟（平路，舒适配速）' },
      { exercise: 'breath-360', dose: '5轮' },
      { exercise: 'pelvic-tilt', dose: '1×8-10' },
      { kind: 'note', text: '舒适体位放松 2 分钟（仰卧屈膝或侧卧）' }
    ]
  },
  H1: {
    id: 'H1', name: 'H1 核心控制', sub: '15-20分钟 · 居家', location: 'home',
    items: [
      { exercise: 'dead-bug', dose: '2×6-8/侧' },
      { exercise: 'glute-bridge', dose: '2×10-12' },
      { exercise: 'bird-dog', dose: '2×6-8/侧' },
      { exercise: 'side-plank', dose: '2×15-20秒/侧' }
    ]
  },
  H2: {
    id: 'H2', name: 'H2 功能课', sub: '18-25分钟 · 居家', location: 'home',
    items: [
      { kind: 'note', text: '快走 5-8 分钟（热身）' },
      { exercise: 'sit-stand', dose: '2×10' },
      { exercise: 'step-up', dose: '2×8/侧' },
      { exercise: 'split-squat', dose: '2×6-8/侧', note: '徒手完成，一手扶墙保持平衡' },
      { exercise: 'side-plank', dose: '2×20秒/侧' }
    ]
  },
  HG: {
    id: 'HG', name: 'HG 健身房日激活', sub: '8-10分钟 · 居家', location: 'home',
    items: [
      { exercise: 'breath-360', dose: '3轮' },
      { exercise: 'dead-bug', dose: '1×6/侧' },
      { exercise: 'glute-bridge', dose: '1×10' },
      { exercise: 'bird-dog', dose: '1×6/侧' }
    ]
  },
  A: {
    id: 'A', name: 'A课 · 深蹲+拉力+抗旋转', sub: '约45-55分钟 · 健身房', location: 'gym',
    items: [
      { kind: 'note', text: '单车/跑步机 6-8 分钟（热身）' },
      { exercise: 'pallof-press', dose: '2-3×8-12/侧' },
      { exercise: 'goblet-squat', dose: '2-3×6-10' },
      { exercise: 'chest-row', dose: '2-3×8-12' },
      { exercise: 'farmer-carry', dose: '3×20-40米' }
    ]
  },
  B: {
    id: 'B', name: 'B课 · 髋伸+单腿+拉力', sub: '约45-55分钟 · 健身房', location: 'gym',
    items: [
      { kind: 'note', text: '单车/椭圆机 6-8 分钟（热身）' },
      { exercise: 'hip-thrust', dose: '2-3×8-12' },
      { exercise: 'split-squat', dose: '2-3×6-10/侧' },
      { exercise: 'lat-pulldown', dose: '2-3×8-12' },
      { exercise: 'gym-step-up', dose: '2×6-10/侧' }
    ]
  },
  C: {
    id: 'C', name: 'C课 · 轻量技术课（第5周后）', sub: '约35-40分钟 · 健身房', location: 'gym',
    items: [
      { kind: 'note', text: '有氧 10 分钟（热身）' },
      { kind: 'note', text: '髋铰链练习 / 垫高壶铃硬拉 2-3×6（轻重量，专注髋部向后折叠）' },
      { exercise: 'pallof-press', dose: '2×10/侧' },
      { exercise: 'farmer-carry', dose: '3×20米' }
    ]
  }
};

/* 12周计划模板 */
const PROGRAM = {
  phases: [
    {
      weeks: [1, 2], name: '镇静与建立规律',
      home: '每天10-15分钟，以H0为主；隔日1轮H1',
      gym: '每周2次A/B，RPE 3-4，每动作1-2组',
      gate: '能步行10-15分钟；连续7天无腿症状远端扩散'
    },
    {
      weeks: [3, 4], name: '核心控制与基础动作',
      home: '每天15-20分钟，H1与H0交替',
      gym: '每周2次A/B，RPE 4-5，每动作2组',
      gate: '桥式2×12、鸟狗每侧2×8；快走20分钟'
    },
    {
      weeks: [5, 6, 7, 8], name: '耐力与功能容量',
      home: '每天15-25分钟，H1/H2各2天、H0 3天',
      gym: '每周2次A/B；连续2周绿灯可加第3次C课，RPE 5-6，每动作2-3组',
      gate: '快走30分钟；侧桥每侧20-30秒'
    },
    {
      weeks: [9, 10, 11, 12], name: '力量与回归',
      home: '每天10-20分钟，转为激活与恢复',
      gym: '每周2-3次A/B/C，RPE 5-7，主动作3组；按门槛加入轻RDL',
      gate: '连续2-3周稳定，能以良好技术完成目标负荷'
    }
  ],
  weekly2x: ['A+HG', 'H0', 'H1', 'B+HG', 'H0', 'H2', 'H0+步行'],
  weekly3x: ['A+HG', 'H0', 'B+HG', 'H0', 'C+HG', 'H0+步行', 'H1短版'],
  dayNames: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
};

const PATH_TIPS = {
  disc: '腰突伴腿症状路径：训练中注意腿症状是否向远端扩散（向小腿/足部蔓延），一旦出现立即停止该动作。',
  local: '局部腰痛路径：关注次日负荷反应——训练后24小时内疼痛不应明显加重，如加重则降级。'
};
