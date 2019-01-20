User.find_or_create_by!(name: 'user1') do |user|
  user.password = 'pass'
end
