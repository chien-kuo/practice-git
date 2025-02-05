# Memo

- this is a practice project.
- markdown syntax test.
- try my first push through ssh protocol.
- this is written at my laptio.
- 230125 : add school info. @ desktop
- 250201 : reborn
- 250202 : test2

> #!/usr/bin/bash
> sources=(
> 'https://github.com/jlanzarotta/bufexplorer.git'
> 'https://github.com/preservim/nerdtree.git'
> 'https://github.com/preservim/vim-markdown.git'
> 'https://github.com/itchyny/lightline.vim.git'
> )
> 
> for i in "${sources[@]}"; do
>     plugin=`basename ${i} .git`
>     echo ${plugin}
>     git clone ${i} ~/.vim/pack/vendor/start/${plugin}
>     vim -u NONE -c "helptags ~/.vim/pack/vendor/start/${plugin}/doc" -c q
> done
