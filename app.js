'use strict';

const traitKeys=['out','calm','cute','chaos','social'];
const option=(text,out,calm,cute,chaos,social)=>({text,score:{out,calm,cute,chaos,social}});
// Small density corrections keep niche edge profiles reachable without changing their trait targets.
const roleCalibration={'奶兔':-1,'西格玛奶蛙':-2.5};

const roles=[
  {
    name:'奶蛙',image:'assets/na-wa.png',temperature:'火山',tagline:'一没人推进，你就会接过方向盘',
    traits:{out:5,calm:0,cute:1,chaos:4,social:4},buddy:'奶蛋',
    hook:'你不是每次都想当主角，但现场一旦没人推进，你就会本能地接过方向盘。',
    behaviors:['朋友群里安静太久，你会直接抛话题、定时间，最后连地点都顺手订了。','遇到不熟的人，你通常先开口；聊顺了容易把刚想到的主意也一起倒出来。','被误解时你很难装作没事，更习惯当场说清楚；生气来得快，但讲明白后也散得快。','喜欢一个人时，你会明显增加出现频率：约对方、分享新鲜事、把“下次”真的变成安排。','压力大时你反而会找事做。比起原地纠结，先动起来哪怕走点弯路也更像你。'],
    others:'大家觉得你胆子大、能带气氛，也默认“这事交给你就会往前走”。',
    self:'你知道自己不是真的永远有底气，只是比起冷场和停滞，你更受不了什么都不发生。',
    hidden:'你看似只顾着往前冲，其实很快就能发现谁一直没插上话，并会给对方留个入口。',
    buddyReason:'奶蛋不会抢你的方向盘，却能在你冲太快时让节奏慢半拍；你负责把世界打开，它负责让你记得坐下来。'
  },
  {
    name:'奶蛋',image:'assets/nai-dan.png',temperature:'烫',tagline:'嘴上说都行，心里其实有首选',
    traits:{out:1,calm:4,cute:5,chaos:0,social:2},buddy:'小奶蛙',
    hook:'你嘴上常说“都行”，其实心里早就有一个最想选的答案，只是不想让别人为难。',
    behaviors:['在朋友群里你不负责刷屏，但谁认真说了件事，你往往会好好接住，不让消息晾在那里。','遇到不熟的人会先观察，熟起来以后才会露出黏人、话多和会撒娇的那一面。','被冷落时你不太会当场追问，表面继续正常，回家后却会把细节重新想一遍。','喜欢一个人时，你不一定说得直接，但会记住对方随口提过的口味、日期和小习惯。','做决定会顾及很多人的感受；拖延往往不是懒，而是想等到一个“大家都舒服”的选法。'],
    others:'别人眼里你软乎、好说话，是相处时不需要提防的人。',
    self:'其实你有明确的偏好和底线，只是重要的事没碰到之前，你懒得为小事争。',
    hidden:'你会给常用物品固定位置，也会悄悄保留票根、包装或聊天截图这种小纪念。',
    buddyReason:'小奶蛙会把你没说出口的开心放大，也会拉你从反复犹豫里出来；你则能接住它忽高忽低的情绪。'
  },
  {
    name:'小奶蛙',image:'assets/xiao-nai-wa.png',temperature:'烫',tagline:'情绪藏不住，快乐也不打算藏',
    traits:{out:3,calm:1,cute:5,chaos:4,social:3},buddy:'奶豆',
    hook:'你的表情比嘴更早交代答案：喜欢就是眼睛亮，不爽就连句号都看起来有脾气。',
    behaviors:['群聊里你可能不是一直在线，但一出现就会带着表情包、怪图和一串很有现场感的反应。','面对不熟的人会先收着一点，一旦对方接住你的梗，熟悉进度会突然快进。','被误解时你先委屈，想解释又怕越说越乱；过一会儿通常会发一段比预想更真诚的话。','喜欢一个人时很难完全装住，会频繁分享“你看这个”，也会在对方回得慢时偷偷降温。','独处时你能从一个视频笑到另一个视频，计划好的休息很容易变成毫无规律的小冒险。'],
    others:'别人觉得你反应鲜活、很好逗，跟你聊天很少掉到地上。',
    self:'你知道自己的热情不是无限供应；没被好好回应时，你会比表现出来的更快心凉。',
    hidden:'你记不住很多大道理，却很容易记住别人当时的语气和脸色。',
    buddyReason:'奶豆能把你的临时兴奋变成真的行动，还不嫌你的情绪转弯快；你们凑一起，普通一天也会有剧情。'
  },
  {
    name:'奶鼠',image:'assets/nai-shu.png',temperature:'热',tagline:'舒服不是摆烂，是你认真经营的生活',
    traits:{out:1,calm:5,cute:4,chaos:1,social:2},buddy:'奶粉',
    hook:'你不是没有上进心，你只是坚信：能坐着解决的事，没必要站着焦虑。',
    behaviors:['群聊热闹时你会潜水看完，真正想回的人和话题才会让你慢慢冒头。','面对不熟的人礼貌但不多交底，通常要一起吃过几次饭，才会把真实吐槽放出来。','压力大时你先把自己撤回安全区：关消息、找吃的、睡一觉，恢复后再处理。','喜欢一个人时你会把对方纳入自己的舒服日常，例如固定一起吃饭，而不是天天制造大场面。','做决定喜欢选稳定省心的方案；最容易拖延的是那些步骤多、回报又很远的事。'],
    others:'大家觉得你脾气稳、待在旁边很放松，好像很少把自己逼得太紧。',
    self:'你知道自己不是没情绪，只是习惯等情绪退潮后再决定要不要说。',
    hidden:'你对椅子、枕头、灯光和食物温度有一套细小但坚定的标准。',
    buddyReason:'奶粉懂你的慢节奏，也会温和地把必要的事往前推一点；你们不需要硬聊，待在一起就很顺。'
  },
  {
    name:'奶豆',image:'assets/nai-dou.png',temperature:'热',tagline:'人还没到，群里的气氛已经先到了',
    traits:{out:4,calm:1,cute:4,chaos:4,social:5},buddy:'奶狗',
    hook:'你很少只是“参加一个局”——人还没到，你已经在群里把气氛炒热了。',
    behaviors:['朋友群里你会接每个人的梗，还能把一句随口提议变成一场真的活动。','遇到不熟的人也敢先递话题，只要对方愿意回应，你很快就能找到共同点。','被冷落时你会先加倍热闹，确认真的没人接后才突然安静，而且退得很彻底。','喜欢一个人时藏不住分享欲，看到好吃的、好笑的、第一个想到的常常都是对方。','做决定靠兴奋感启动，开头特别快；拖延通常发生在新鲜感退去、只剩收尾的时候。'],
    others:'别人眼里你像人群里的充电宝，活动少了你会明显安静一截。',
    self:'其实你也会担心自己是不是太吵，只是越在意一群人，越想让大家都别无聊。',
    hidden:'你会记得谁最近没出现，并用一个看似随意的话题把对方重新拉回来。',
    buddyReason:'奶狗跟得上你的社交电量，还擅长把你的灵光一闪落实成安排；你负责点火，它负责让火不灭。'
  },
  {
    name:'奶狗',image:'assets/nai-gou.png',temperature:'热',tagline:'喜欢谁，就会把谁放进自己的行程表',
    traits:{out:4,calm:2,cute:3,chaos:2,social:5},buddy:'奶豆',
    hook:'你的在乎很少停在心里：喜欢谁，就会主动联系、顺手照顾，再把对方放进下一次计划。',
    behaviors:['群里有人问“谁有空”，你常常是最早认真回复的人，还会顺手确认其他人的时间。','对不熟的人也愿意释放善意，但如果连续几次得不到回应，你会收回得很有分寸。','被误解时会急着解释；被冷落比争吵更让你难受，因为你最怕关系忽然没有着落。','喜欢一个人时行动比暗示多：送到门口、提醒吃饭、陪对方办那些无聊的小事。','压力大时会找信任的人说一遍；说完未必需要建议，只要知道有人站在这边就能继续。'],
    others:'别人觉得你热心、靠谱，找你帮忙时很少只得到一句“加油”。',
    self:'你知道自己的付出带着期待——不求一样多，但希望对方别把它当成理所当然。',
    hidden:'你嘴上说“顺便”，其实很多体贴都是提前想过的。',
    buddyReason:'奶豆能毫不扭捏地回应你的热情，也会不断提供新鲜事；你们互相给反馈，很少让爱意掉在地上。'
  },
  {
    name:'奶粉',image:'assets/nai-fen.png',temperature:'温',tagline:'看起来随和，重要的事却很难被左右',
    traits:{out:2,calm:4,cute:4,chaos:2,social:3},buddy:'奶鼠',
    hook:'你看起来很好说话，但真正重要的事情，别人其实很难把你推离自己的答案。',
    behaviors:['朋友群里你通常负责温和地补一句，让争论别太僵，也让被忽略的人有台阶。','遇到不熟的人会礼貌配合，但不会为了显得合群就立刻交出全部私人边界。','被误解时先判断值不值得解释；在意的人面前会认真说，不重要的人那里就让它过去。','喜欢一个人时会照顾细节，但不会全天黏着；你更想要稳定回应，而不是忽冷忽热的刺激。','你做决定不算快，却很少因为别人催就乱选；压力大时先整理环境，也顺便整理脑子。'],
    others:'别人觉得你温和、有耐心，好像什么话都能跟你好好说。',
    self:'你知道自己也有脾气，只是很少浪费在无关紧要的地方；一旦失望到位，就不会反复解释。',
    hidden:'你对熟人的语气变化非常敏感，常常在对方开口求助前就已经察觉。',
    buddyReason:'奶鼠尊重你的边界，也懂得一起安静；你能帮它把生活照顾得更细，它能提醒你不必事事周全。'
  },
  {
    name:'奶鸡',image:'assets/nai-ji.png',temperature:'温',tagline:'平时不抢话，关键时刻却不会掉线',
    traits:{out:2,calm:4,cute:3,chaos:3,social:3},buddy:'奶兔',
    hook:'你平时不抢话，但事情真到关键处，大家会发现你一直在，而且脑子很清醒。',
    behaviors:['群聊里你常看完再说，一开口多半是补信息、定重点，偶尔再丢一句延迟生效的冷梗。','对不熟的人不主动表演自己，不过该打招呼、该帮忙时一点也不含糊。','被误解时先检查是不是自己没说明白，再决定解释；真被冒犯了也不会无限退让。','喜欢一个人时更像稳定队友：记得承诺、按时出现，不太擅长花哨的甜言蜜语。','你做决定会兼顾现实和感受；拖延多半是因为想把事情一次做对，不想返工。'],
    others:'别人觉得你低调可靠，平时存在感不吵，出问题时却很容易想到你。',
    self:'其实你脑内也经常跑偏，只是大部分怪念头都先过了审核，熟人才看得到完整版。',
    hidden:'你会默默记住一群人的习惯，安排座位或点餐时不声不响地避开雷区。',
    buddyReason:'奶兔不会逼你一直说话，却能听懂你没讲完的半句；你给它现实支点，它给你柔软的喘气处。'
  },
  {
    name:'奶猫',image:'assets/nai-mao.png',temperature:'温',tagline:'不是高冷，只是不想把电量浪费在客套上',
    traits:{out:0,calm:5,cute:3,chaos:2,social:1},buddy:'奶鱼',
    hook:'你不是高冷，只是不想把有限的电量浪费在重复客套和没必要的热闹上。',
    behaviors:['群聊里你经常已读全场，真正有信息或特别好笑时才精准冒泡。','遇到不熟的人会维持礼貌距离，对方越急着套近乎，你反而越想往后退一步。','被冷落时你很少追着问，会先把注意力收回来；但在意的人造成的落差，你会记很久。','喜欢一个人时会允许对方进入自己的私人时间，主动发一张照片或一句废话已经是明显信号。','独处不是补救而是刚需。你休息时最怕临时电话，也最喜欢没人要求回应的几个小时。'],
    others:'别人觉得你安静、有边界，有时很难判断你到底开心还是不开心。',
    self:'你知道自己并不冷，只是热情需要安全感；一旦认定了人，耐心会比很多外向的人更久。',
    hidden:'你会反复回看喜欢的聊天或作品，但被问起时往往只说“还行”。',
    buddyReason:'奶鱼懂得不打扰，也不把沉默误会成疏远；你们能各做各的，偶尔一句话就接上同一条频道。'
  },
  {
    name:'奶屎',image:'assets/nai-shi.png',temperature:'冷',tagline:'别人还在讲逻辑，你已经拐进下一层梗',
    traits:{out:2,calm:3,cute:1,chaos:5,social:2},buddy:'奶茶',
    hook:'别人还在认真讲逻辑，你已经在脑内拐进下一层梗，只是在挑一个能听懂的人投放。',
    behaviors:['群聊快冷掉时，你会丢一句完全偏航的话；有人接住，全群就会进入你的临时世界观。','面对不熟的人你可能异常正常，直到确认对方耐受度，才一点点释放真实频道。','被误解时你常先自嘲或玩梗，避免把脆弱直接摆上桌，之后才决定要不要认真说明。','喜欢一个人时会分享非常私人化的怪图、黑话和冷门东西——这是你的信任凭证。','压力大时你靠荒诞感自救，把糟心事起个怪名字，事情好像就没那么能控制你。'],
    others:'别人觉得你脑回路难预测，安静时正常，一开口就可能让全桌停两秒再爆笑。',
    self:'你知道玩笑不只是玩笑，它也是你的缓冲层；越难受的时候，你反而越可能说得像段子。',
    hidden:'你对“谁真正听懂了”非常敏感，会因此把一个人悄悄划进自己人范围。',
    buddyReason:'奶茶的冷静吐槽接得住你的跳跃，还能替你的怪梗补上最后一刀；你们不必解释太多就能互相听懂。'
  },
  {
    name:'豆奶',image:'assets/dou-nai.png',temperature:'冷',tagline:'能安静一整天，也能突然把气氛掀翻',
    traits:{out:2,calm:4,cute:3,chaos:4,social:2},buddy:'奶猫',
    hook:'你可以安静一整天，也可以在最意想不到的时候把气氛掀翻——切换不需要预告。',
    behaviors:['群聊里你有时失踪很久，有时连发十条；活跃程度主要看话题有没有碰到你的开关。','遇到不熟的人先给出稳定版本的自己，熟了以后对方才发现你的画风根本不止一套。','被误解时表面冷静，心里会模拟很多种解释；最后可能只挑最短的一句发出去。','喜欢一个人时会一会儿主动、一会儿撤回自己的世界，不是吊人胃口，而是在确认距离是否安全。','做决定先看整体是否稳妥，但也会为了一个突然心动的细节临时改道。'],
    others:'别人觉得你状态很稳，又偶尔会被你的突然放飞打个措手不及。',
    self:'你知道自己的反差不是人设，而是不同场合真的会调用不同版本的你。',
    hidden:'你会给一些普通日常配上只有自己懂的设定，让无聊生活多一点秘密剧情。',
    buddyReason:'奶猫尊重你的忽近忽远，不会逼问每次沉默；它的稳定边界让你更敢放心露出奇怪的那面。'
  },
  {
    name:'奶兔',image:'assets/nai-tu.png',temperature:'冷',tagline:'看起来没事，其实每个细节都进了心里',
    traits:{out:1,calm:5,cute:5,chaos:1,social:2},buddy:'奶鸡',
    hook:'你看起来总能轻轻带过，实际上别人的一句话、一个语气，常常会在心里停留很久。',
    behaviors:['朋友群里你多半安静跟着，看到有人情绪不对，会私下问一句，而不是在群里公开点名。','遇到不熟的人温和但拘谨，需要明确的善意和几次稳定互动才会真正放松。','被误解或冷落时你先怀疑是不是自己哪里没做好，难受够了才慢慢把边界立起来。','喜欢一个人时会变得很细致，记住对方的偏好，也会因为一句及时回应开心很久。','独处时你有完整的小世界：熟悉的歌、反复看的东西、固定的小仪式，都能让你恢复。'],
    others:'别人觉得你软、安静、很好相处，常常低估你对关系变化的敏感。',
    self:'你知道自己不是没有原则，只是不喜欢用冲突证明原则；真正越线后，你会安静地离远。',
    hidden:'你会预先想好怎样拒绝才不伤人，结果有时光组织措辞就花了很久。',
    buddyReason:'奶鸡的稳定和守信让你不用反复猜，它也不会把你的敏感当麻烦；你则能看见它藏在可靠外表下的疲惫。'
  },
  {
    name:'奶鱼',image:'assets/nai-yu.png',temperature:'冷',tagline:'不是跟不上大家，是不想每条路都跟',
    traits:{out:0,calm:5,cute:2,chaos:3,social:1},buddy:'奶猫',
    hook:'你不是跟不上大家，只是不想每一条热闹的路都跟；自己的节奏乱了，什么都不值。',
    behaviors:['群聊里你常常晚一点才看，回复也不追求覆盖全部，只回应真正想说的部分。','对不熟的人不敌对，也不急着证明好相处；关系能不能近，交给时间筛。','被误解时你会先衡量解释成本。若对方已经认定答案，你宁可省下力气。','喜欢一个人时不会高频轰炸，但会稳定地留位置；对方需要时，你出现得比嘴上承诺更准。','做决定时很少跟风，休息也真的想断开连接；你的拖延常常是在等待内心愿意启动。'],
    others:'别人觉得你淡定、随缘，似乎不太容易被外界带着跑。',
    self:'你知道自己并非什么都不在乎，只是越重要的东西越不愿拿出来热闹展示。',
    hidden:'你可能会为了一个喜欢的东西研究很深，只是从不主动把这份认真包装成谈资。',
    buddyReason:'奶猫同样珍惜安静和边界，不会拿联系频率衡量感情；你们的陪伴像留灯，不刺眼但一直在。'
  },
  {
    name:'奶茶',image:'assets/nai-cha.png',temperature:'冷',tagline:'表面岁月静好，心里弹幕一秒没停',
    traits:{out:2,calm:4,cute:2,chaos:5,social:2},buddy:'奶屎',
    hook:'你表面坐得很稳，心里弹幕一秒没停；不开口只是因为还没等到最准确的那一句。',
    behaviors:['群聊里你不追求条条参与，但总能在关键节点发一句，让前面十分钟突然有了结论。','对不熟的人保持正常礼貌，幽默会先收着；判断对方接得住后才逐渐提高浓度。','被误解时你会用半真半假的玩笑试探，如果对方认真听，才把真正介意的部分说出来。','喜欢一个人时嘴上仍然会损两句，但会把语气拿捏得很轻，也会悄悄给对方留特殊待遇。','压力大时你需要先独处消化，再用吐槽把事情重新编排成自己能掌控的版本。'],
    others:'别人觉得你冷静、会吐槽，常常一句话就把大家模糊感觉到的东西说穿。',
    self:'你知道精准的幽默背后其实是观察得太细；有些话看似随口，已经在脑子里改过三版。',
    hidden:'你很少正面求安慰，却会用一句异常普通的“在干嘛”发出求救信号。',
    buddyReason:'奶屎提供你最喜欢的意外角度，你负责把它的离谱提炼成绝杀句；彼此都懂玩笑后面可能藏着真心。'
  },
  {
    name:'奶瓶',image:'assets/nai-ping.png',temperature:'冷',tagline:'不爱争，但也不会无限让',
    traits:{out:1,calm:5,cute:4,chaos:1,social:1},buddy:'奶蛋',
    hook:'你不爱争，不代表没有答案；很多时候你只是觉得，为不重要的人解释自己太费电。',
    behaviors:['群聊里你常等有明确问题再回复，不喜欢为了保持在线而硬找存在感。','遇到不熟的人客气、周到，但私人生活会关得很稳，不会因为对方热情就自动敞开。','被误解时先沉默，确认关系值得才解释；反复踩线的人会发现你不是吵，而是直接关门。','喜欢一个人时慢而稳定，会通过照顾习惯表达，真正说出口之前通常已经观察了很久。','压力大时你需要独处、整理和可预期的安排；临时变化太多会让你明显耗电。'],
    others:'别人觉得你省心、温和，很少把坏情绪直接倒给身边的人。',
    self:'你知道自己也想被主动照顾，只是不习惯开口，更不喜欢让需要变成负担。',
    hidden:'你会提前准备备用方案和小物件，看似随手拿出来，其实是在给自己安全感。',
    buddyReason:'奶蛋懂得温柔回应，也不会逼你立刻表态；它能看见你的需要，你能给它稳定、不忽冷忽热的空间。'
  },
  {
    name:'西格玛奶蛙',image:'assets/sigma-nai-wa.png',temperature:'冷',tagline:'热闹可以围着你发生，但很难替你做决定',
    traits:{out:1,calm:5,cute:1,chaos:4,social:0},buddy:'奶蛙',
    hook:'热闹可以围着你发生，但很难替你做决定；你宁可暂时不被理解，也不想走一条不认同的路。',
    behaviors:['群聊里你很少为了合群跟一句，通常只在有实际内容或真的好笑时出现。','遇到不熟的人不紧张，也不主动取悦；别人觉得场面冷，你可能觉得刚刚好。','被误解时你会先判断对方有没有理解意愿，没有的话就不浪费第二轮解释。','喜欢一个人时仍然需要大量自己的空间；真正的信任，是愿意让对方看见你没整理过的生活。','做决定习惯独立验证，压力大时也更愿意自己消化。你会拖延没意义的流程，却能为认定的事长时间专注。'],
    others:'别人觉得你主意正、难带节奏，有时甚至不确定你是否需要任何人。',
    self:'你知道自己不是不需要连接，只是比起很多浅联系，更想要少数不必表演的关系。',
    hidden:'你其实会默默关注在意的人，只是不常点赞、不频繁问候，关心藏在很具体的行动里。',
    buddyReason:'奶蛙敢直接闯进你过度封闭的时刻，又足够坦率，不需要你猜；你则能在它冲过头时给出最不受气氛影响的判断。'
  }
];

const questions=[
  {emoji:'🎉',text:'朋友突然喊你出门，你会？',options:[option('鞋穿好了，人呢？',5,0,1,2,5),option('先问都有谁、去哪儿',2,4,1,0,3),option('有吃的我就去',3,2,4,1,4),option('装没看见',0,4,2,4,0)]},
  {emoji:'🧃',text:'一杯奶茶洒了，你第一反应？',options:[option('赶紧抽纸抢救，动作比脑子快',4,1,1,1,2),option('先把旁边东西挪开，再慢慢收拾',1,5,0,0,1),option('盯着它心疼三秒：“我的奶茶……”',1,2,5,1,2),option('拍张照发群：案发现场',3,1,1,5,4)]},
  {emoji:'🛌',text:'周末最理想的打开方式？',options:[option('约朋友出去逛逛',4,1,2,1,5),option('睡到自然醒',0,5,2,0,0),option('窝着刷喜欢的视频',1,5,5,1,2),option('起床以后再说，想到哪做到哪',2,2,2,4,2)]},
  {emoji:'📱',text:'你的聊天风格最接近？',options:[option('语音一条接一条',5,0,1,2,5),option('已读了，但要认真想想怎么回',1,5,1,0,2),option('一句话配三个贴贴表情包',3,1,5,4,5),option('怪图比正常句子多',3,1,1,5,4)]},
  {emoji:'🧑‍🤝‍🧑',text:'朋友心情不好，你会？',options:[option('拉TA出去走走，先换个环境',4,1,1,1,5),option('不追问，安静陪一会儿',1,5,2,0,4),option('带点TA爱吃的小东西',2,3,5,0,4),option('先讲个离谱笑话试试水温',4,1,4,5,5)]},
  {emoji:'🍜',text:'大家纠结吃什么时？',options:[option('我来拍板，先吃上再说',5,1,1,1,4),option('都可以，谁有想吃的就听谁的',1,4,2,0,4),option('我会选一家看着顺眼的',2,3,5,1,3),option('打开转盘，交给命运',2,2,1,5,3)]},
  {emoji:'🫣',text:'被人当面夸可爱时，你会？',options:[option('点头：你很有眼光',5,1,2,2,4),option('笑一下，赶紧把话题转走',1,5,3,0,2),option('嘿嘿，谢谢！',2,3,5,0,4),option('当场做个更离谱的表情',4,1,4,5,4)]},
  {emoji:'🚀',text:'一个没参加过的新活动出现，你通常？',options:[option('名先报了，细节之后看',5,0,1,2,4),option('先看看具体是干嘛的',1,5,1,0,1),option('问问朋友要不要一起',4,1,4,3,5),option('先看有没有什么特别好玩的',2,2,2,5,2)]},
  {emoji:'🎭',text:'你平时最容易刷着刷着停下来看哪种视频？',options:[option('节奏很快的高能整活',4,0,1,4,3),option('安安静静、看着很治愈的',0,5,3,0,1),option('小动物或软乎乎的日常',1,5,5,1,2),option('完全不知道该怎么解释的抽象视频',2,4,2,5,2)]},
  {emoji:'🧠',text:'遇到棘手问题时，你会？',options:[option('先动手试几种方法',5,1,1,2,2),option('自己把前因后果慢慢理清',1,5,0,0,0),option('找个人聊聊，一起想',3,2,2,1,5),option('先试一个别人可能不会想到的办法',2,4,2,5,1)]},
  {emoji:'💬',text:'群聊突然安静了，你会？',options:[option('主动开个新话题',5,1,1,1,5),option('正好，安静待一会儿',0,5,1,0,0),option('随手丢个表情包看看有没有人接',3,1,5,4,5),option('发一句没人能接的怪话',2,4,2,5,2)]},
  {emoji:'🌧️',text:'碰上下雨天，你更可能？',options:[option('照样出门，该干嘛干嘛',4,2,1,1,2),option('待在家里听雨做自己的事',0,5,1,0,0),option('裹好毯子，再弄杯热饮',0,5,5,1,1),option('拍个视频配一段离谱 BGM',2,3,1,5,3)]},
  {emoji:'🎂',text:'过生日时你更喜欢？',options:[option('叫上一群人热闹一下',5,1,1,2,5),option('和很熟的人简单吃顿饭',1,5,2,0,3),option('收到一份明显用过心的小礼物',1,4,5,0,3),option('出现一个完全没猜到的环节',4,1,4,5,5)]},
  {emoji:'🛒',text:'逛超市时你经常？',options:[option('目标明确，拿完就走',4,3,0,0,1),option('照着清单一项项慢慢买',1,5,1,0,0),option('被好看的包装吸引过去',1,3,5,1,2),option('带回一个本来完全没打算买的东西',2,1,2,5,2)]},
  {emoji:'🪩',text:'去 KTV 时你通常是？',options:[option('先点两首热场，唱开了就不撒手',5,0,1,2,5),option('熟悉的歌会跟着哼，麦递来再唱',1,5,2,0,2),option('负责切歌、递麦，谁唱都认真鼓掌',2,3,4,1,5),option('正常唱两首，然后开始模仿原唱',4,1,3,5,4)]},
  {emoji:'👀',text:'刚认识的人说“你和我想的不太一样”，你会？',options:[option('马上追问：你原来觉得我什么样？',5,1,1,2,4),option('笑笑，回去以后才慢慢琢磨',1,5,1,0,1),option('先担心是不是哪里表现得不太好',1,3,5,0,3),option('回一句：你看到的还只是试用版',2,4,2,5,2)]},
  {emoji:'🎮',text:'玩游戏时你更喜欢？',options:[option('冲前面带节奏',5,1,1,2,4),option('自己慢慢探索地图',0,5,1,1,0),option('收集、养成，顺便把角色打扮好',1,5,5,1,2),option('专门测试一些奇怪玩法',1,5,1,4,0)]},
  {emoji:'📷',text:'拍合照时你更常？',options:[option('自然站到前面招呼大家看镜头',5,1,1,1,5),option('找个边边，能拍到就行',0,5,1,0,1),option('认真摆一个满意的小手势',2,3,5,1,3),option('在按快门那刻贡献奇怪表情',4,1,3,5,4)]},
  {emoji:'🫧',text:'压力很大时，你最常怎么缓过来？',options:[option('去走路、运动，先把劲儿放出去',4,2,1,1,1),option('关掉消息，一个人待会儿',0,5,1,0,0),option('找信任的人聊一聊',2,3,4,0,5),option('刷梗、说怪话，先把自己逗笑',2,2,1,5,3)]},
  {emoji:'🌈',text:'如果只能选一种超能力，你想要？',options:[option('瞬间移动，想去哪就去哪',5,1,1,2,3),option('时间暂停，终于没人催我',0,5,1,1,0),option('让在意的人快点好起来',1,3,5,0,5),option('让所有严肃场合随机响起音乐',3,1,1,5,3)]},
  {emoji:'🍰',text:'朋友把最后一口蛋糕让给你，你会？',options:[option('那我就不客气了，下次我请',4,2,1,1,4),option('再确认一句：你真的不吃？',1,5,3,0,4),option('明显开心，然后分一小口回去',2,3,5,0,5),option('接过来发表三十秒获奖感言',4,1,3,5,4)]},
  {emoji:'🌙',text:'凌晨突然冒出一个好点子，你会？',options:[option('先做一点，不然睡不着',5,1,1,3,1),option('记下来，明天清醒了再看',1,5,0,0,0),option('立刻发给那个最懂我的朋友',3,2,3,2,5),option('顺着想下去，最后发展成另一件事',1,5,1,4,0)]},
  {emoji:'🐾',text:'路上遇到一只很可爱的小动物，你会？',options:[option('停下来跟它打个招呼',4,2,4,1,3),option('隔着一点距离看看就好',0,5,3,0,0),option('心里已经软成一团，但不敢打扰',1,5,5,1,1),option('边走边给它起了个奇怪名字',2,4,2,5,2)]},
  {emoji:'🧊',text:'发现有人误解了你的意思，你会？',options:[option('当场把哪句话被误会了讲清楚',5,1,1,1,4),option('先不急，等对方愿意听时再说',1,5,1,0,2),option('会难受一阵，但不太会马上开口',0,3,5,0,2),option('先用一句玩笑把气氛接住，再找机会说',3,2,1,5,4)]},
  {emoji:'🍟',text:'聚餐桌上只剩最后一根薯条，你会？',options:[option('问一圈，没人要我就吃了',4,3,1,0,4),option('留着吧，说不定还有人想吃',0,5,2,0,3),option('掰成两半，找个人一起分',2,3,5,1,5),option('宣布“薯条继承权争夺战”开始',4,1,3,5,5)]},
  {emoji:'📚',text:'刚开始学一个新东西时，你通常？',options:[option('先动手，卡住了再回头查',5,1,1,2,1),option('先把教程从头到尾过一遍',0,5,1,0,0),option('找个也想学的人，边聊边试',3,2,3,1,5),option('先点开最感兴趣的部分，顺序之后再补',1,5,1,4,0)]},
  {emoji:'🎁',text:'给朋友挑礼物时，你最在意？',options:[option('拿到就能用，而且最好有点惊喜',4,3,2,1,3),option('是不是对方现在真正需要的',1,5,2,0,4),option('看得出我记得TA喜欢什么',1,3,5,0,5),option('打开那一刻能不能让TA笑出来',4,1,4,5,5)]},
  {emoji:'🧸',text:'你的房间里最不能少的是？',options:[option('能让我随时活动起来的空间',4,2,1,1,1),option('一个可以安静窝着的角落',0,5,2,0,0),option('看一眼就心情变好的小东西',1,5,5,1,1),option('一个没什么用但每次看都想笑的摆件',2,4,2,5,2)]},
  {emoji:'🎢',text:'碰到一个没把握的新挑战，你会？',options:[option('先答应，办法路上再想',5,0,1,3,3),option('观察一下规则和风险再决定',1,5,0,0,1),option('如果有熟人一起，我愿意试试',2,3,4,1,5),option('有点慌，但也觉得像新剧情开场',4,1,3,5,3)]},
  {emoji:'⏳',text:'临时多出半天空闲，你最可能？',options:[option('马上问问谁有空，或者直接出门',5,1,1,2,5),option('把手机调安静，留给自己慢慢过',0,5,1,0,0),option('买点喜欢的吃的，找个舒服地方窝着',1,5,5,1,2),option('去做一件早就想试、但没什么用的怪事',1,5,1,4,0)]}
];

let answers=[];
let index=0;
let currentRole=null;
const byId=id=>document.getElementById(id);
const escapeHTML=value=>String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

function show(id){
  ['home','quiz','result'].forEach(section=>byId(section).classList.toggle('hidden',section!==id));
  scrollTo(0,0);
}

function start(){
  answers=[];
  index=0;
  render();
  show('quiz');
}

function render(){
  const questionData=questions[index];
  byId('count').textContent=`${index+1} / ${questions.length}`;
  byId('fill').style.width=(index/questions.length*100)+'%';
  byId('qemoji').textContent=questionData.emoji;
  byId('question').textContent=questionData.text;
  byId('options').innerHTML=questionData.options.map((item,answerIndex)=>`<button class="option${answers[index]===answerIndex?' selected':''}" aria-pressed="${answers[index]===answerIndex}" onclick="choose(${answerIndex})"><span>${'ABCD'[answerIndex]}.</span>${escapeHTML(item.text)}</button>`).join('');
}

function choose(answerIndex){
  answers[index]=answerIndex;
  index++;
  if(index>=questions.length) finish();
  else{
    render();
    scrollTo(0,0);
  }
}

function previous(){
  if(index===0) show('home');
  else{
    index--;
    render();
    scrollTo(0,0);
  }
}

function finish(){
  const totals=Object.fromEntries(traitKeys.map(key=>[key,0]));
  questions.forEach((questionData,questionIndex)=>{
    const selected=questionData.options[answers[questionIndex]];
    traitKeys.forEach(key=>totals[key]+=selected.score[key]);
  });
  const averages=Object.fromEntries(traitKeys.map(key=>[key,totals[key]/questions.length]));
  currentRole=roles
    .map(role=>({role,distance:traitKeys.reduce((sum,key)=>sum+(role.traits[key]-averages[key])**2,0)+(roleCalibration[role.name]||0)}))
    .sort((a,b)=>a.distance-b.distance)[0].role;

  const role=currentRole;
  byId('temperature').textContent='🌡️ '+role.temperature+'系奶门';
  byId('rimage').src=role.image;
  byId('rimage').alt=role.name;
  byId('rname').textContent=role.name;
  byId('tagline').textContent=role.tagline;
  byId('description').innerHTML=`
    <p class="result-hook">${escapeHTML(role.hook)}</p>
    <ul class="result-list">${role.behaviors.map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul>
    <div class="result-insight"><strong>别人眼里的你</strong><p>${escapeHTML(role.others)}</p></div>
    <div class="result-insight"><strong>其实你自己知道的你</strong><p>${escapeHTML(role.self)}</p></div>
    <div class="result-insight"><strong>一个容易被忽略的小特点</strong><p>${escapeHTML(role.hidden)}</p></div>
    <div class="result-buddy"><strong>最佳奶门搭子 · ${escapeHTML(role.buddy)}</strong><p>${escapeHTML(role.buddyReason)}</p></div>`;
  byId('buddy').textContent=role.buddy;
  byId('chaos').textContent=Math.round(averages.chaos/5*100)+'%';
  show('result');
}

function restart(){start()}

function rounded(ctx,x,y,w,h,r,fill=true,stroke=false){
  ctx.beginPath();
  ctx.roundRect(x,y,w,h,r);
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}

function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines=4){
  let line='';
  const lines=[];
  for(const character of text){
    const trial=line+character;
    if(ctx.measureText(trial).width>maxWidth&&line){
      lines.push(line);
      line=character;
    }else line=trial;
  }
  if(line) lines.push(line);
  lines.slice(0,maxLines).forEach((item,lineIndex)=>ctx.fillText(item,x,y+lineIndex*lineHeight));
}

async function saveCard(event){
  const button=event.currentTarget;
  button.disabled=true;
  button.textContent='正在生成身份卡…';
  try{
    const canvas=document.createElement('canvas');
    canvas.width=1080;
    canvas.height=1440;
    const ctx=canvas.getContext('2d');
    const gradient=ctx.createLinearGradient(0,0,1080,1440);
    gradient.addColorStop(0,'#fff6bd');
    gradient.addColorStop(.55,'#fffdf7');
    gradient.addColorStop(1,'#ffe0d4');
    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,1080,1440);
    ctx.textAlign='center';
    ctx.fillStyle='#291f1d';
    ctx.font='900 55px sans-serif';
    ctx.fillText('奶门身份鉴定局',540,92);
    ctx.fillStyle='#826b62';
    ctx.font='26px sans-serif';
    ctx.fillText('你的奶籍已经藏不住了',540,137);
    ctx.fillStyle='#fff';
    ctx.strokeStyle='#291f1d';
    ctx.lineWidth=8;
    rounded(ctx,65,185,950,1085,48,true,true);
    ctx.fillStyle='#ffdc4f';
    ctx.strokeStyle='#291f1d';
    ctx.lineWidth=5;
    rounded(ctx,350,225,380,70,35,true,true);
    ctx.fillStyle='#291f1d';
    ctx.font='900 29px sans-serif';
    ctx.fillText(byId('temperature').textContent,540,270);
    const image=new Image();
    image.src=byId('rimage').src;
    await image.decode();
    const scale=Math.min(560/image.width,475/image.height);
    const width=image.width*scale;
    const height=image.height*scale;
    ctx.drawImage(image,(1080-width)/2,315+(475-height)/2,width,height);
    ctx.fillStyle='#291f1d';
    ctx.font='900 86px sans-serif';
    ctx.fillText(byId('rname').textContent,540,875);
    ctx.fillStyle='#745d55';
    ctx.font='700 34px sans-serif';
    ctx.fillText(byId('tagline').textContent,540,927);
    ctx.fillStyle='#fff8dd';
    rounded(ctx,125,965,830,157,27,true,false);
    ctx.fillStyle='#453732';
    ctx.font='30px sans-serif';
    wrapText(ctx,currentRole.hook,540,1015,735,42,3);
    ctx.fillStyle='#f5e8ff';
    rounded(ctx,125,1150,395,83,23,true,false);
    ctx.fillStyle='#eaf6df';
    rounded(ctx,560,1150,395,83,23,true,false);
    ctx.fillStyle='#735d55';
    ctx.font='700 23px sans-serif';
    ctx.fillText('抽象浓度',322,1182);
    ctx.fillText('最佳奶搭子',758,1182);
    ctx.fillStyle='#291f1d';
    ctx.font='900 34px sans-serif';
    ctx.fillText(byId('chaos').textContent,322,1218);
    ctx.fillText(byId('buddy').textContent,758,1218);
    ctx.fillStyle='#291f1d';
    ctx.font='800 26px sans-serif';
    ctx.fillText('🥛 测测你是奶门里的谁',540,1342);
    ctx.fillStyle='#8b746c';
    ctx.font='22px sans-serif';
    ctx.fillText('纯娱乐趣味测试 · 奶籍仅供快乐参考',540,1382);
    const download=document.createElement('a');
    download.href=canvas.toDataURL('image/png');
    download.download='我的奶门身份-'+byId('rname').textContent+'.png';
    download.click();
  }finally{
    button.disabled=false;
    button.textContent='📸 保存奶门身份卡';
  }
}
