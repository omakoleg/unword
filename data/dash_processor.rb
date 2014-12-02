require 'optparse'
require 'csv'


options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: <name>.rb [options] filename.txt"
  opts.on("-r", "--reverse", "Create reverse question - answer pairs") do |v|
    options[:reverse] = v
  end
end.parse!

if ARGV.length == 0
  p "No file specified"
  exit
end
filename = ARGV[0]
data = File.open(filename, 'r') {|f| f.read }

if data.empty?
  p "File empty"
  exit
end

filename = File.basename(filename,File.extname(filename))
filename = "#{filename}.reverse" if options[:reverse]
CSV.open("#{filename}.csv",'w', 
    :write_headers=> true,
    :headers => ["question","question_explain","answer", "answer_explain"]
  ) do |hdr|
    data.split("\n").each do |line|
      data = line.split("—").map{|i| i.strip }
      data = data.reverse if options[:reverse]
      hdr << [data[0], "", data[1], ""]
    end
end
