import random as rd
import sys
import time

bankCard = "config.txt" # 配置文件（游戏保存文件）
fr = None # 配置文件读取对象
fw = None # 配置文件写入对象

# 设置初始值
i = 0 # 随机摇号数
target = 25 # 中奖号码
threshold = 10 # 默认摇号次数,调大中奖概率大 【1-50】
balance = 10.0 # 默认余额，上线就送10块钱
bounce = 1.0 # 默认赢钱数
punish = 1.0 # 默认输钱数
lend = 10.0 # 默认借款数
totalLend = 0 # 总借款数
totalBounce = 0 # 累积赢钱数
totalPunish = 0 # 累积输钱数
totalWin = 0 # 最后赢钱数
totalLose = 0 # 最后输钱数
n = 1.1 # 默认借款后赔率
interval = 0.05 # 摇号信息打印速度

icon = """
__________                        __  _____________    _________    \n
\____    /____   ____    ____    |__|/ ____\_____  \  /   _____/    \n
  /     // __ \ /    \  / ___\   |  \   __\ /   |   \ \_____  \     \n
 /     /\  ___/|   |  \/ /_/  >  |  ||  |  /    |    \/        \    \n
 /_______ \___  >___|  /\___  /\__|  ||__|  \_______  /_______  /   \n
        \/   \/     \//_____/\______|              \/        \/     \n
"""

def displayHolder(row):
    """根据文本长短规定文本在屏幕上打印的间隔时间"""
    sleepShort = 2
    sleepMedium = 5
    sleepLong = 8
    
    if 0 < len(row) < 50:
        time.sleep(sleepShort)
    elif 50 <= len(row) < 80:
        time.sleep(sleepMedium)
    else:
        time.sleep(sleepLong)

def storyLine():
    """故事线 - 《YOU SHOULD PLAY!!!》"""
    script = "script.txt" # 故事脚本
    #script = "script_JP.txt" # 日文风格故事脚本
    isPlay = ""
    
    time.sleep(2)
    
    f = open(script, mode="r", encoding = "utf-8")
    story = f.readlines()
    
    for line in story:
        header = line.split("|")[0]
        content = line.split("|")[1]
        
        # 根据互动判断打印哪些故事内容
        # 首先打印主故事线
        if header == "story" and isPlay == "":
            print(content)
            displayHolder(content)
        # 获得输入
        elif header == "input" and isPlay == "":
            isPlay = input(content)
            continue
        # 若输入为继续游戏，则打印故事线1  
        elif header == "storyLine1" and isPlay.upper() == "Y":
            print(content)
            displayHolder(content)
        # 若输入为结束游戏，则打印故事线2  
        elif header == "storyLine2" and isPlay.upper() == "N":
            print(content)
            displayHolder(content)
        else:
            pass
            
            
def lendToPlayer(vTotalLend, vLend, vBalance, vBounce, vPunish, vN):
    """借款给玩家，借款立刻打入余额，下次的奖励金变为上次的vN倍，但下次惩罚金也变为上次的vN倍。
       若不借款退出游戏，则触发故事线。
    """
    isLend = input(lendNotice.format(round(vBalance,1), round(vLend,1), round(vN*vBounce,1), round(vN*vPunish,1), vLend))

    if isLend.upper() == "Y":

        print("已打{0}进入你的账户".format(vLend))
        vBalance += vLend
        vTotalLend += vLend
      
        vBounce *= vN
        vPunish *= vN
        
        print("若下次中奖则奖励金为前一轮的{0}倍！".format(vN))
        print("若下次未能中奖则惩罚金为前一轮的{0}倍！".format(vN))
        
    elif isLend.upper() == "YY":
        tmpLend = abs(vBalance) + vLend
        vBalance += tmpLend
        vTotalLend += tmpLend
        
        print("已打{0}进入你的账户".format(tmpLend))

        vBounce *= vN
        vPunish *= vN
        
        print("若下次中奖则奖励金为前一轮的{0}倍！".format(vN))
        print("若下次未能中奖则惩罚金为前一轮的{0}倍！".format(vN))
        
    else:
        print("余额不足，游戏结束！\n")
        
        # 启用故事线
        storyLine()
        
        
    return round(vBalance,1), round(vBounce,1), round(vPunish,1), round(vTotalLend,1)
        

try:
    notice = """
               {0} \n
                ==================================================
                -- 中奖号码为 {1}。
                -- 若能在{2}次内摇出，即为中奖。
                -- 只要有余额，可以一直游玩。
                ==================================================
        """.format(icon, target, threshold)
    
    newRndNotice = """
                ==================================================
                -- 当前余额：{0}
                -- 累积借贷额：{1}
                -- 累积输钱数：{2}
                -- 累积赢钱数：{3}
                -----------------------
                        >> 赢：{4}
                        >> 输：{5}
                        >> 余额还完后还欠债务：{6}
                --------------------------------------------------
                -- 下轮奖励金：{7}
                -- 下轮惩罚金：{8}
                ==================================================
                -- 是否进行下一轮摇号？（Y/N）
                ==================================================
        """

    lendNotice = """
                ==================================================
                ......................警告........................
                ..................................................
                .....................WARNING......................
                ..................................................
                ......................警告........................
                ==================================================
                -- 当前余额：{0}
                -- 可单次借贷金额：{1}
                -- 借贷后奖励金：{2}
                -- 借贷后惩罚金：{3}
                --------------------------------------------------
                -- 余额不足！是否借钱继续？
                .............................
                .............................
                .. > 借{4}   -> Y         .. 
                .. > 借全部   -> YY        ..
                .. > 结束游戏 -> N         ..
                .............................
                .............................
                ==================================================
        """
        
    bingoNotice = """
                ==================================================
                ..恭喜....恭喜........恭喜............恭喜........
                .........恭喜.....................恭喜............
                .....................恭喜....恭喜.................
                .............恭喜...................恭喜..........
                ....恭喜........恭喜....恭喜..恭喜..........恭喜..
                ==================================================
                ....................【{0}】.........................
                ...................................................
                ................恭喜你中奖了！.....................
                .............{1} / {2} 次之内就摇到了！...............
                ...................................................
                ...................................................
        """
        
    print(notice)
    
    saveStr = "balance={0}\ntotalLend={1}\ntotalPunish={2}\ntotalBounce={3}\ntotalWin={4}\ntotalLose={5}\ntotalPayback={6}\nbounce={7}\npunish={8}\n"
    
    # 询问是否继续上次已保存的游戏，若是，则从配置文件还原数据，若不是，则用默认值开始游戏。
    isReset = input("继续上次游戏？（Y/N）：")
    if isReset.upper() == "Y":
        checkpoint = dict()
        
        fr = open(bankCard, mode="r", encoding = "utf-8")
        lines = fr.readlines()
        for line in lines:
            fmtLine = line.strip()
            if fmtLine:
                cols = fmtLine.split("=")
                checkpoint[cols[0]] = cols[1]
        
        #从配置文件里还原上次的数据,若无数据，则用上方默认值。
        readBalance = checkpoint["balance"]
        readTotalLend = checkpoint["totalLend"]
        readTotalPunish = checkpoint["totalPunish"]
        readTotalBounce = checkpoint["totalBounce"]
        readtotalWin = checkpoint["totalWin"]
        readtotalLose = checkpoint["totalLose"]
        readtotalPayback = checkpoint["totalPayback"]
        readBounce = checkpoint["bounce"]
        readPunish = checkpoint["punish"]
        
        # 若配置文件中无数据，则用上方默认值。
        if readBalance:
            balance = round(float(readBalance),1)
        else:
            pass
        
        if readTotalLend:
            totalLend = round(float(readTotalLend),1)
        else:
            pass
        
        if readTotalPunish:
            totalPunish = round(float(readTotalPunish),1)
        else:
            pass
        
        if readTotalBounce:
            totalBounce = round(float(readTotalBounce),1)
        else:
            pass 
        
        if readtotalWin:
            totalWin = round(float(readtotalWin),1)
        else:
            pass 
            
        if readtotalLose:
            totalLose = round(float(readtotalLose),1)
        else:
            pass
        
        if readtotalPayback:
            totalPayback = round(float(readtotalPayback),1)
        else:
            pass
            
        if readBounce:
            bounce = round(float(readBounce),1)
        else:
            pass

        if readPunish:
            punish = round(float(readPunish),1)
        else:
            pass
            
        
    # 若进行新游戏，则用初始值开始游戏。   
    else:
        pass


    fw = open(bankCard, "w")
    
    while True:
        # 首先检查余额，若余额充足则开始新一轮游戏，若不足，则跳出余额不足画面。
        if balance <= 0:
            balance, bounce, punish, totalLend = lendToPlayer(totalLend, lend, balance, bounce, punish, n)

        else:
            # 设置输赢状况数据
            if (totalBounce - totalPunish) > 0:
                totalWin = totalBounce - totalPunish
                totalWin = round(totalWin,1)
            else:
                totalWin = 0
                
            if (totalPunish - totalBounce) > 0:
                totalLose = totalBounce - totalPunish
                totalLose = round(totalLose,1)
            else:
                totalLose = 0
            
            if (totalLend - balance) > 0:
                totalPayback = -(totalLend - balance)
                totalPayback = round(totalPayback,1)
            else:
                totalPayback = 0
                
            
                
            # 输出各项数据并询问是否开始下一轮摇号    
            isNewRnd = input(newRndNotice.format(round(balance,1), round(totalLend,1), round(totalPunish,1), round(totalBounce,1), \
                                                round(totalWin,1), round(totalLose,1), round(totalPayback,1), round(bounce,1), \
                                                round(punish,1)))
            
            # 开启下一轮摇号
            if isNewRnd.upper() == "Y":     
                i = rd.randint(0,50)
                rnd = 1
                
                # 若在指定轮数里摇出中奖号码，则打入奖励。
                while rnd <= threshold:
                    
                    if i == target:
                        print("第{0}次摇出了>>>>>> {1} <<<<<<<，中奖啦！！！".format(rnd,i))
                        print(bingoNotice.format(target, rnd, threshold))
                        balance += bounce
                        balance = round(balance,1)
                        totalBounce += bounce
                        totalBounce = round(totalBounce,1)
                        print("你的账户已到账：{0}，余额：{1}".format(bounce, balance))
                        break
                    else:
                        print("第{0}次摇出了>>>>>> {1} <<<<<<<，未中奖，继续摇号中.......".format(rnd,i))
                        time.sleep(interval)
                        i = rd.randint(0,50)
                        rnd += 1
                        
                # 若未在指定轮数里摇出中奖号码，则扣除惩罚金。
                if rnd > threshold:
                    print("很遗憾！未能在 {0} 次之内摇中，必须接受惩罚！".format(threshold))
                    balance -= punish
                    totalPunish += punish
                    
                    balance = round(balance,1) # 修复过多小数位问题
                    totalPunish = round(totalPunish,1) # 修复过多小数位问题
                    print("你的账户已扣除：{0}，余额：{1}".format(punish, balance))
                    
                # 若扣除后余额不足，则跳出额不足画面。
                while balance <= 0:
                    balance, bounce, punish, totalLend = lendToPlayer(totalLend, lend, balance, bounce, punish, n)    
                    
            # 不开启下一轮摇号，游戏结束。     
            else:
                print("游戏结束！".format(balance))
                
                sys.exit()

except Exception as e:
    print("程序错误，但余额{0}已经更新！".format(balance))
    print(e)
     
finally:
    if fr:
        fr.close()
    if fw:
       # 更新数据至配置文件
       fw.seek(0,0)
       fw.write(saveStr.format(str(balance), str(totalLend), str(totalPunish), str(totalBounce), str(totalWin), str(totalLose), str(totalPayback), str(bounce), str(punish))) 

       fw.close()


