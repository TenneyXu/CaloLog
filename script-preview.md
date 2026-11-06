# TouchPair 五分钟 Pitch 视频 · 剧本预览

片长 4 分 50 秒。英文口播，每段下面是对应的中文。

---

**第一场　实验室 · 桌面　0:00**

（桌上一摞薄片。一只手捏住最上面一张往外拉，带出来两张。）

（换正确做法：一只手按住整摞，另一只手把最上面一张滑出来，只有一张。）

（切到机器人夹爪夹住一片薄片。）

**徐天远（画外）**

> Take one sheet from a stack like this. You didn't count. You just know you took one.
>
> 从这么一摞布或者纸里，抽出正好一张。你没数，但你知道你只拿了一张。

> We do it without thinking. One hand holds the stack steady, the other slides the top sheet away. And your fingertips tell you whether you're holding one layer or two.
>
> 人会本能地一只手按住整摞，另一只手去拿。指尖还会告诉你，捏住的是一层，还是两层。

> Now hand the same job to a robot. It doesn't know.
>
> 同一件事交给机器人——它不知道。

---

**第二场　实验室 · 机器人旁　0:23**

（三个人站在机械臂旁边。）

**徐天远**

> We're TouchPair. We're building a dual-arm robot that works by touch: it takes exactly one sheet from a tight stack — every time — and places it flat.
>
> 我们是 TouchPair。我们要做的，是一台靠触觉工作的双臂机器人：从压紧的一摞薄片里，每次正好取出一张，放平。

> It sounds like a small thing. But separating thin sheets is still done by hand — in electronics assembly, in garment making, in printing, in labs.
>
> 这件事听起来小。但电子装配、服装、印刷、实验室，到今天还大量靠人手，一张一张地分。

---

**第三场　实验室 · 机器人旁　0:45**

（另外两人退出画面，只剩徐天远。）

**徐天远**

> Three things make it hard.
>
> 难在三个地方。

> First, cameras can't tell. One sheet and two sheets look the same from above.
>
> 第一，摄像头分不清。一张和两张，从上面看几乎一模一样。

> Second, pull with one arm, and friction drags the next sheet up with it. We call that a double pick.
>
> 第二，只用一只手拉，层和层之间的摩擦会把下面那张一起带起来。我们管它叫"多拿"。

> And third — the one that matters most — the useful information isn't in contact. It's in the moment contact changes.
>
> 第三，也是最关键的：真正有用的信息，不在"碰到了"，而在接触发生变化的那一瞬间。

> That single idea shapes everything we build.
>
> 这一句，就是我们整台机器人的设计出发点。

---

**第四场　实验室 · 机器人旁　1:18**

（Peiyuan 站到机器人旁同一个位置。）

**Peiyuan**

> I'm Peiyuan. I work on touch — and touch answers the third one.
>
> 我是 Peiyuan，我负责触觉。第三条，正好是触觉能回答的。

> Each fingertip carries a tactile array. It reads how pressure is spread across the pad.
>
> 每个指尖上有一片触觉传感器阵列，能读出压力的分布。

> One layer and two layers read differently. And when a sheet starts to slip, the pattern visibly shifts.
>
> 按一层布，和按两层布，读数不一样；开始打滑的时候，分布会明显地移动。

> But a single frame barely shows it. So our model reads a short window of change. A graph network encodes the spatial pattern in each frame. A temporal network encodes how it evolves. And a head predicts what happens next.
>
> 但单看一张图，区别很小。所以我们让模型看一小段变化：先用图卷积把每一帧的空间结构编码，再用时间卷积看它怎么变，最后预测接下来会不会出问题。

> It outputs three things: zero, one or several layers; slip; and whether the stack is being dragged.
>
> 它只输出三件事：手里是零层、一层，还是多层；有没有打滑；整摞有没有被拖动。

> Those three readings drive every correction that follows.
>
> 这三个判断，就是后面所有纠正动作的依据。

---

**第五场　实验室 · 机器人旁　2:06**

（Hongyang 站到同一个位置。）

**Hongyang**

> I'm Hongyang. I own the data.
>
> 我是 Hongyang，我负责数据。

> We teach the robot by teleoperation. A person moves both arms, and we record video, touch and joint states on one clock.
>
> 我们用主从遥操作教机器人：人做一遍，画面、触觉、关节状态一起录下来。

> About three hundred demonstrations per material. Some of them are deliberate failures — because to learn to correct, the robot has to see what failure feels like.
>
> 每种材料大约三百条示范。里面有一部分是故意做错的——要让机器人学会纠正，它得先见过失败长什么样。

> Every episode is labelled in three modes: normal, correction, recovery. And the rule is strict. Two people label the same batch. If they agree on less than eighty percent, we rewrite the rule.
>
> 每条数据都按三段标注：正常执行、小修正、失败后重来。规则定得很死：两个人标同一批，一致率不到八成，就回去改规则。

---

**第六场　实验室 · 大图旁　2:44**

（徐天远走到旁边的系统架构大图前。）

**徐天远**

> Here's the whole system, on one diagram.
>
> 整台系统，就这一张图。

> The top path is vision. Cameras see the whole scene. They're slow, but they see far. Vision proposes the base motion for both arms.
>
> 上面一路是视觉：摄像头看全局，反应慢，但看得远。它负责提出两只手的基础动作。

> The bottom path is touch. It only looks at the fingertips. It's fast. And it doesn't replan anything — it adds a small correction when contact goes wrong.
>
> 下面一路是触觉：只看指尖，反应快。它不重新规划，只在接触出问题的时候，加一个小修正。

> In one sentence: vision proposes, touch corrects.
>
> 一句话：视觉提方案，触觉来纠正。

> In the middle sits a router. It decides, for the next fraction of a second, whether to follow vision, follow a tactile correction, or back off and re-grasp. It's stateful, so it doesn't flip back and forth.
>
> 中间是一个路由器。它决定这一小段时间听视觉的、听触觉纠正的，还是干脆退出来重抓。它带记忆，所以不会在两路之间来回跳。

> And here's the part only two arms can do. Each hand's touch informs the other. The anchor feels the stack being dragged, and tells the picker to slow down. The picker confirms one layer — and only then does the anchor lift.
>
> 双臂独有的地方在这儿：两只手的触觉是互相看的。锚手感到整摞被拖动，就告诉拾取手放慢；拾取手确认只拿了一层，锚手才抬起来。

> At the bottom, safety. Every action passes through joint limits and contact-force constraints before it becomes a motor command.
>
> 最底下是安全：所有动作都要过一遍关节限位和接触力的约束，然后才变成电机的指令。

---

**第七场　实验室 · 机器人旁　3:47**

（徐天远从大图旁走回机器人旁。）

**徐天远**

> So how do we know touch actually helps?
>
> 我们怎么知道触觉真的有用？

> Four versions, same materials: vision only; vision plus a fixed tactile threshold; vision plus a learned correction from the picker alone; and the full version, with touch shared across both hands.
>
> 同一批材料，四个版本对比：只用视觉；固定阈值的触觉；只用拾取手的触觉；还有双手共享触觉。

> At least fifty real trials each. We report success rate, double-pick rate, and time per sheet.
>
> 每种至少五十次真机试验。报三个数：成功率、多拿率、每张用时。

> And because we can switch the correction off, we can measure exactly what touch adds.
>
> 触觉那一路可以随时关掉——所以它到底贡献了多少，能被单独量出来。

---

**第八场　实验室 · 机器人旁　4:15**

（三个人重新站回机械臂旁边，还是开场那个位置。）

**徐天远**

> We're not drawing a system on paper.
>
> 我们不是在纸上画一个系统。

> The arm, the grippers, the tactile fingertips — they're already in our lab. We're putting them together into one robot that can feel. And then we add the hardest piece: touch shared between the two hands.
>
> 机械臂、夹爪、触觉指尖，实验室里现成就有。我们把它们装成一台会"摸"的双臂机器人，再补上最难的那一块——两只手之间的触觉共享。

> Twelve months. Three people. One measurable result.
>
> 十二个月。三个人。一个可以量的结果。

---

**第九场　夹爪特写　4:40**

（机器人夹爪夹住一片薄片抬起来。画面右上角叠一个触觉热力图，标着"1 layer"。）

**徐天远（画外）**

> We want the robot to know, for the first time, how many layers it's holding.
>
> 我们要让机器人第一次，摸得出来，自己拿了几层。

（定格，淡出。出现队名与校名：TouchPair — Feeling Every Layer / Duke Kunshan University。）
