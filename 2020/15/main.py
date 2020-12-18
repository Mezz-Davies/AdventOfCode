inpt = open("input.txt").read().split(",")
 
numbers_said = {0:0}
last_turn_said = {0:[]}
turn = 1
max_num = 0
last_said = None
 
for num in inpt:
    if int(num) in numbers_said:
        numbers_said[int(num)] += 1
    else:
        numbers_said[int(num)] = 1
    last_turn_said[int(num)] = [turn]
    turn += 1
 
    max_num = max(max_num, numbers_said[int(num)])
    last_said = int(num)
 
    # input(f"Turn: {turn-1} Number: {last_said}")
 
# while max_num < 30_000_000:
for i in range(30_000_000 - len(inpt)):
    if numbers_said[last_said] == 1:
        last_said = 0
        numbers_said[0] += 1
        last_turn_said[0].append(turn)
 
    elif last_said in numbers_said:
        last_said = last_turn_said[last_said][-1] - last_turn_said[last_said][-2]
 
        if last_said in numbers_said:
            numbers_said[last_said] += 1
            last_turn_said[last_said].append(turn)
        else:
            numbers_said[last_said] = 1
            last_turn_said[last_said] = [turn]
 
    else:
        numbers_said[last_said] = 1
        last_turn_said[last_said] = [turn]
 
    turn += 1
    max_num = max(max_num, numbers_said[last_said])
 
    # input(f"Turn: {turn-1} Number: {last_said}")
 
    if (i % 100_000 == 0):
        print(i)
 
print(last_said)