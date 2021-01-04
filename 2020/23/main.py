puzzle_input = '963275481'
class Node:
    pass

vals = [int(x) for x in list(puzzle_input.strip())] + list(range(10,1000000+1))
nodes = [Node() for _ in vals]

for node, other, val in zip(nodes, nodes[1:] + nodes, vals):
    node.right = other
    node.value = val
lookup = {node.value: node for node in nodes}

cur = nodes[0]
for _ in range(10000000):
    three = cur.right, cur.right.right, cur.right.right.right
    cur.right = three[-1].right
    n = cur.value - 1
    if n == 0:
        n = 1000000
    while n not in range(1, 1000000+1) or any(node.value == n for node in three):
        n -= 1
        if n == 0:
            n = 1000000
    dest = lookup[n]
    three[2].right = dest.right
    dest.right = three[0]
    cur = cur.right

print(lookup[1].right.value * lookup[1].right.right.value)