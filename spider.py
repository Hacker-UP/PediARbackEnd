from urllib import urlretrieve

f = open('./iPhone_url.txt','r')
imgUrls = f.readlines()
flag = 0
for i in imgUrls:
	extends = i.split('.')[-1].split('\n')[0]
	if(extends != 'png' and extends != 'jpg'):
		continue
	try:
		urlretrieve(i, './image/iphone'+str(flag)+'.'+extends)
		print('save successful')
	except:
		print('error')
	flag += 1
