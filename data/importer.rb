require 'nokogiri'
require 'zlib'
include Zlib

# require 'stardict'
# 
# stardict=StarDict.new('dict') #without any extension.
# #you can also access dictionary options (.ifo file data) by:
# 
# puts stardict.bookname #prints the book/dict name

data = GzipReader.open("dict.dict.dz"){|f|f.read}
# File.write('dict.dict',data)
# p data.read(100)
# data.rewind
# puts data[0..3000]
doc = Nokogiri::XML(data)
p doc.xpath("k")[0].content
