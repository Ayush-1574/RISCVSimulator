.data
n: .word -5
.text
addi x21,x0,0#counter of 1
addi x22,x0,0 #counter of 0
lui x4 ,0x10000
addi x4,x4,0x000 # loading value of n in x4
lw x4,0(x4)

addi x11,x0,1 
addi x2,x0,2
addi x16,x0,32

hello:
xori x5,x4,1
sub x5 ,x4,x5
beq x5,x11,counter

divide:
srli x4,x4,1
bge x4,x11,hello
sub x22,x16,x21
jal x0, exit

counter:
addi x21,x21,1 #counting numbers of 1 in the binary version of N
jal x0,divide


exit: